import { TrackedStat, UserResponse } from '@interfaces';
import { AnalyticsService } from '@modules/content/analytics.service';
import { ConstantsService } from '@modules/content/constants.service';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userError, userSuccessObject } from '@utils/usernotifications';
import { capitalize } from 'lodash';
import { Logger } from 'nestjs-pino';

@Injectable()
export class WorshipService {
  constructor(
    private readonly constants: ConstantsService,
    private readonly logger: Logger,
    private readonly playerService: PlayerService,
    private readonly statsService: StatsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async worship(userId: string, deity: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (player.deityPrayerCooldown > Date.now())
      return userError('You cannot pray to your deity again so soon.');

    if (
      !['travel', 'xp', 'coins', 'offense', 'defense', 'nothing'].includes(
        deity,
      )
    )
      return userError('That deity does not exist.');

    this.logger.verbose(`Player ${userId} is worshipping ${deity}.`);

    const playerPatches = await getPatchesAfterPropChanges(
      player,
      async (playerRef) => {
        playerRef.deityPrayerCooldown =
          Date.now() + 1000 * 60 * 60 * this.constants.worshipCooldown;

        playerRef.deityBuffs = {
          ...(playerRef.deityBuffs || {}),
          [deity]: Date.now() + 1000 * 60 * 60 * this.constants.worshipDuration,
        };
      },
    );

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:Worship:${deity}`,
      1,
    );

    await this.statsService.incrementStat(userId, 'worships' as TrackedStat, 1);
    await this.statsService.incrementStat(
      deity,
      `worship${capitalize(deity)}` as TrackedStat,
      1,
    );

    return {
      player: playerPatches,
      actions: [userSuccessObject(`You pray to your deity!`)],
    };
  }
}
