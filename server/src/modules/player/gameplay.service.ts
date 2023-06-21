import { IItem, ILocation, TrackedStat } from '@interfaces';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { NotificationService } from '@modules/notification/notification.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import * as jsonpatch from 'fast-json-patch';
import { sample } from 'lodash';

type ExploreResult = 'Nothing' | 'Wave' | 'Item' | 'Discovery' | 'Collectible';

const createFilledArray = (length: number, fill: ExploreResult) =>
  Array(length).fill(fill);

@Injectable()
export class GameplayService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly statsService: StatsService,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService,
    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
  ) {}

  async explore(userId: string): Promise<{
    player: jsonpatch.Operation[];
    discoveries: jsonpatch.Operation[];
  }> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    if (player.location.cooldown > Date.now())
      return { player: [], discoveries: [] };

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    if (!discoveries) throw new ForbiddenException('Discoveries not found');

    let foundLocation: ILocation | undefined;

    foundLocation = this.contentService.getLocation(player.location.current);

    if (!foundLocation) {
      foundLocation = this.contentService.getLocation('Mork');
    }

    if (!foundLocation) return { player: [], discoveries: [] };

    let exploreResult: ExploreResult = 'Nothing';

    if (foundLocation) {
      const choices = [
        ...createFilledArray(
          (this.constantsService.wavePercentBoost +
            foundLocation.baseStats.wave) |
            0,
          'Wave',
        ),
        ...createFilledArray(
          (this.constantsService.locationFindPercentBoost +
            foundLocation.baseStats.locationFind) |
            0,
          'Discovery',
        ),
        ...createFilledArray(
          (this.constantsService.itemFindPercentBoost +
            foundLocation.baseStats.itemFind) |
            0,
          'Item',
        ),
        ...createFilledArray(
          (this.constantsService.collectibleFindPercentBoost +
            foundLocation.baseStats.collectibleFind) |
            0,
          'Collectible',
        ),
      ];

      if (choices.length < 100) {
        const nothings = createFilledArray(100 - choices.length, 'Nothing');
        choices.push(...nothings);
      }

      exploreResult = sample(choices);
    }

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        if (!foundLocation) return;

        playerRef.location = {
          ...playerRef.location,
          current: foundLocation.name,
        };

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

        // reset explore action
        this.playerService.setPlayerAction(playerRef, undefined);

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

        if (exploreResult === 'Wave') {
          await this.playerService.handleRandomWave(playerRef);
        }

        if (exploreResult === 'Collectible') {
          await this.playerService.handleFindCollectible(
            playerRef,
            foundLocation,
          );
        }

        if (exploreResult === 'Item') {
          await this.playerService.handleFindItem(playerRef, foundLocation);
        }
      },
    );

    const discoveriesPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discRef) => {
        if (!foundLocation) return;

        if (exploreResult === 'Discovery') {
          await this.playerService.handleDiscoveries(
            player,
            discRef,
            foundLocation,
          );
        }
      },
    );

    return { player: playerPatches, discoveries: discoveriesPatches };
  }

  async walkToLocation(
    userId: string,
    locationName: string,
  ): Promise<jsonpatch.Operation[]> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    if (player.location.goingTo === locationName)
      throw new ForbiddenException(
        `You are already walking to ${locationName}!`,
      );

    if (player.location.current === locationName)
      throw new ForbiddenException(`You are already at ${locationName}!`);

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    if (!discoveries) throw new ForbiddenException('Discoveries not found');

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
    if (!player) throw new ForbiddenException('Player not found');

    if (player.location.current === locationName)
      throw new ForbiddenException('You are already here!');

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );
    if (!discoveries) throw new ForbiddenException('Discoveries not found');

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

  async waveToPlayer(
    userId: string,
    targetUserId: string,
    isWaveBack: boolean,
  ) {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

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
      void this.notificationService.createNotificationForUser(
        targetUserId,
        {
          liveAt: new Date(),
          text: `${player.profile.displayName} waved back at you!`,
          actions: [],
        },
        1,
      );

      // give the target a chance to wave back at us
    } else {
      void this.notificationService.createNotificationForUser(
        targetUserId,
        {
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
        1,
      );
    }

    return playerPatches;
  }

  async takeItem(userId: string) {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        const item: IItem = player.action?.actionData.item;
        if (!item) return;

        await this.inventoryService.acquireItem(userId, item.itemId);

        // clear it from the location action
        this.playerService.setPlayerAction(playerRef, {
          text: 'Took item!',
          action: 'takeconfirm',
          actionData: {
            item,
          },
        });
      },
    );

    return playerPatches;
  }
}
