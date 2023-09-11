import { INotificationAction, TrackedStat, UserResponse } from '@interfaces';
import { AnalyticsService } from '@modules/content/analytics.service';
import { NotificationService } from '@modules/notification/notification.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { Logger } from 'nestjs-pino';

@Injectable()
export class WaveService {
  constructor(
    private readonly logger: Logger,
    private readonly playerService: PlayerService,
    private readonly statsService: StatsService,
    private readonly analyticsService: AnalyticsService,
    private readonly events: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async waveToPlayerFromExplore(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    if (!player.action) throw new ForbiddenException('Player has no action');

    return this.waveToPlayer(userId, player, player.action);
  }

  async waveToPlayerFromNotification(
    userId: string,
    notificationId: string,
  ): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const notification = await this.notificationService.getNotificationForUser(
      userId,
      notificationId,
    );
    if (!notification) throw new ForbiddenException('Notification not found');

    const notificationAction = notification.actions?.[0];
    if (!notificationAction)
      throw new ForbiddenException('Notification has no actions');

    this.logger.verbose(
      `Player ${userId} is waving to ${notificationAction.urlData.targetUserId} from notification.`,
    );

    return this.waveToPlayer(userId, player, notificationAction);
  }

  private async waveToPlayer(
    userId: string,
    player: Player,
    action: INotificationAction,
  ) {
    const { targetUserId, isWaveBack } = action?.urlData ?? {};

    const otherPlayer = await this.playerService.getPlayerForUser(targetUserId);
    if (!otherPlayer) throw new ForbiddenException('Target player not found');

    const stats = await this.statsService.getStatsForUser(targetUserId);
    if (!stats) throw new ForbiddenException('Stats not found');

    // tell the user they waved
    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        // clear it from the location action
        const locationAction = playerRef.action;
        if (
          locationAction?.action === 'wave' &&
          locationAction.actionData?.player?.userId === targetUserId
        ) {
          this.playerService.setPlayerAction(player, {
            text: 'Waved!',
            action: 'waveconfirm',
            actionData: {
              player: playerRef.action?.actionData.player,
            },
          });
        }
      },
    );

    // share the stat tracking
    await this.statsService.incrementStat(userId, 'wavesTo' as TrackedStat, 1);
    await this.statsService.incrementStat(
      otherPlayer.userId,
      'wavesFrom' as TrackedStat,
      1,
    );

    // notify the target they were waved back at
    if (isWaveBack) {
      this.events.emit('notification.create', {
        userId: targetUserId,
        notification: {
          liveAt: new Date(),
          text: `${player.profile.displayName} waved back at you!`,
          actions: [],
        },
        expiresAfterHours: 1,
      });

      // give the target a chance to wave back at us
    } else {
      this.events.emit('notification.create', {
        userId: targetUserId,
        notification: {
          liveAt: new Date(),
          text: `You were waved at by ${player.profile.displayName}!`,
          actions: [
            {
              text: 'Wave back',
              action: 'waveback',
              actionData: {
                player,
              },
              url: 'gameplay/wave',
              urlData: {
                targetUserId: userId,
                isWaveBack: true,
              },
            },
          ],
        },
        expiresAfterHours: 1,
      });
    }

    this.analyticsService.sendDesignEvent(userId, `Gameplay:Wave`);

    this.logger.verbose(`Player ${userId} waved to ${targetUserId}.`);

    return { player: playerPatches };
  }
}
