import { TrackedStat, UserResponse } from '@interfaces';
import { AnalyticsService } from '@modules/content/analytics.service';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { percentNumberAsMultiplier } from '@utils/number';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userError } from '@utils/usernotifications';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TravelService {
  constructor(
    private readonly logger: Logger,
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly statsService: StatsService,
    private readonly contentService: ContentService,
    private readonly analyticsService: AnalyticsService,
    private readonly events: EventEmitter2,
    private readonly playerHelper: PlayerHelperService,
    private readonly constants: ConstantsService,
  ) {}

  async walkToLocation(
    userId: string,
    locationName: string,
  ): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);

    if (player.location.goingTo === locationName)
      return userError(`You are already walking to ${locationName}!`);

    if (player.location.current === locationName)
      return userError(`You are already at ${locationName}!`);

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    const location = this.contentService.getLocation(locationName);

    if (player.level < location.level)
      return userError('You are not high enough level to go here!');

    if (!discoveries.locations[locationName])
      return userError('You have not discovered this location yet!');

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:Walk:${location.name}`,
    );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        let steps = location.steps;
        if (this.playerHelper.isDeityTravelSpeedBuffActive(playerRef)) {
          steps -= Math.floor(
            steps *
              percentNumberAsMultiplier(this.constants.worshipTravelBoost),
          );
        }

        playerRef.location = {
          ...playerRef.location,
          goingTo: location.name,
          arrivesAt: steps,
        };
      },
    );

    this.logger.verbose(`Player ${userId} is walking to ${locationName}.`);

    return { player: playerPatches };
  }

  async travelToLocation(
    userId: string,
    locationName: string,
  ): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);

    if (player.location.current === locationName)
      return userError('You are already here!');

    if (player.action?.action === 'fight')
      return userError('You cannot travel while fighting!');

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    const location = this.contentService.getLocation(locationName);

    if (player.level < location.level)
      return userError('You are not high enough level to go here!');

    if (!discoveries.locations[locationName])
      return userError('You have not discovered this location yet!');

    const cost = location.cost ?? 0;

    if (!this.playerHelper.hasCoins(player, cost)) {
      return userError('You do not have enough coins to travel here!');
    }

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:Travel:${location.name}`,
    );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.spendCoins(playerRef, cost);

        playerRef.location = {
          ...playerRef.location,
          current: location.name,
          goingTo: '',
          arrivesAt: 0,
        };

        this.playerService.setPlayerAction(playerRef, undefined);
      },
    );

    this.events.emit('sync.player', player);

    this.logger.verbose(`Player ${userId} is traveling to ${locationName}.`);

    await this.statsService.incrementStat(
      userId,
      'timesTraveled' as TrackedStat,
      1,
    );

    return { player: playerPatches };
  }
}
