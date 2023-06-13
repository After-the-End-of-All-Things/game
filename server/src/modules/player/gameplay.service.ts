import { ILocation } from '@interfaces';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { Injectable } from '@nestjs/common';
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
        foundLocation =
          this.contentService.locations[playerRef.location.current];

        if (!foundLocation) {
          playerRef.location.current = 'Mork';
          foundLocation =
            this.contentService.locations[playerRef.location.current];
        }

        const baseXp = this.constantsService.baseExploreXp;
        const xpGainPercent = foundLocation.baseStats.xpGain;
        const xpGained = Math.floor(baseXp * (xpGainPercent / 100));

        this.playerService.gainXpForPlayer(playerRef, xpGained);

        const baseCoins = this.constantsService.baseExploreCoins;
        const coinsGainPercent = foundLocation.baseStats.coinGain;
        const coinsGained = Math.floor(baseCoins * (coinsGainPercent / 100));

        this.playerService.gainCoinsForPlayer(playerRef, coinsGained);

        const baseExploreSpeed = this.constantsService.baseExploreSpeed;
        const explorePercent = foundLocation.baseStats.exploreSpeed;
        const totalExploreSpeed = Math.max(
          1,
          baseExploreSpeed * (explorePercent / 100),
        );

        playerRef.location = {
          ...playerRef.location,
          cooldown: Date.now() + Math.floor(totalExploreSpeed * 1000),
        };
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
}
