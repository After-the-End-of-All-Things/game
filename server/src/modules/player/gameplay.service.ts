import { ILocation } from '@interfaces';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import * as jsonpatch from 'fast-json-patch';

@Injectable()
export class GameplayService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
  ) {}

  async explore(userId: string): Promise<{
    player: jsonpatch.Operation[];
    discoveries: jsonpatch.Operation[];
  }> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (player.location.cooldown > Date.now())
      return { player: [], discoveries: [] };

    let foundLocation: ILocation;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        foundLocation = this.contentService.getLocation(
          playerRef.location.current,
        );

        if (!foundLocation) {
          playerRef.location.current = 'Mork';
          foundLocation = this.contentService.getLocation(
            playerRef.location.current,
          );
        }

        // gain xp
        const baseXp = this.constantsService.baseExploreXp;
        const xpGainPercent = foundLocation.baseStats.xpGain;
        const xpGained = Math.floor(baseXp * (xpGainPercent / 100));

        this.playerService.gainXp(playerRef, xpGained);

        // gain coins
        const baseCoins = this.constantsService.baseExploreCoins;
        const coinsGainPercent = foundLocation.baseStats.coinGain;
        const coinsGained = Math.floor(baseCoins * (coinsGainPercent / 100));

        this.playerService.gainCoins(playerRef, coinsGained);

        // get cooldown
        const baseExploreSpeed = this.constantsService.baseExploreSpeed;
        const explorePercent = foundLocation.baseStats.exploreSpeed;
        const totalExploreSpeed = Math.max(
          1,
          baseExploreSpeed * (explorePercent / 100),
        );

        // put explore on cooldown
        playerRef.location = {
          ...playerRef.location,
          cooldown: Date.now() + Math.floor(totalExploreSpeed * 1000),
        };

        // travel via walk if the flags are set
        if (playerRef.location.goingTo && playerRef.location.arrivesAt > 0) {
          playerRef.location = {
            ...playerRef.location,
            arrivesAt: playerRef.location.arrivesAt - 1,
          };

          if (playerRef.location.arrivesAt <= 0) {
            playerRef.location = {
              ...playerRef.location,
              current: playerRef.location.goingTo,
              goingTo: '',
              arrivesAt: 0,
            };
          }
        }
      },
    );

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    const discoveriesPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discRef) => {
        await this.playerService.handleDiscoveries(
          player,
          discRef,
          foundLocation,
        );
      },
    );

    return { player: playerPatches, discoveries: discoveriesPatches };
  }

  async walkToLocation(
    userId: string,
    locationName: string,
  ): Promise<jsonpatch.Operation[]> {
    const player = await this.playerService.getPlayerForUser(userId);

    if (player.location.goingTo === locationName)
      throw new ForbiddenException(
        `You are already walking to ${locationName}!`,
      );

    if (player.location.current === locationName)
      throw new ForbiddenException(`You are already at ${locationName}!`);

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    const location = this.contentService.getLocation(locationName);
    if (!location) throw new ForbiddenException('Location does not exist!');

    if (player.level < location.level)
      throw new ForbiddenException('You are not high enough level to go here!');

    if (!discoveries.locations[locationName])
      throw new ForbiddenException(
        'You have not discovered this location yet!',
      );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.location = {
          ...playerRef.location,
          goingTo: location.name,
          arrivesAt: location.steps,
        };
      },
    );

    return playerPatches;
  }

  async travelToLocation(userId: string, locationName: string): Promise<any> {
    const player = await this.playerService.getPlayerForUser(userId);

    if (player.location.current === locationName)
      throw new ForbiddenException('You are already here!');

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    const location = this.contentService.getLocation(locationName);
    if (!location) throw new ForbiddenException('Location does not exist!');

    if (player.level < location.level)
      throw new ForbiddenException('You are not high enough level to go here!');

    if (!discoveries.locations[locationName])
      throw new ForbiddenException(
        'You have not discovered this location yet!',
      );

    const cost = location.cost ?? 0;

    if (!this.playerService.hasCoins(player, cost)) {
      throw new ForbiddenException(
        'You do not have enough coins to travel here!',
      );
    }

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerService.spendCoins(playerRef, cost);

        playerRef.location = {
          ...playerRef.location,
          current: location.name,
          goingTo: '',
          arrivesAt: 0,
        };
      },
    );

    return playerPatches;
  }
}
