import { itemSlotForItem, itemValue } from '@helpers/item';
import {
  IEquipment,
  IFullUser,
  IItem,
  ILocation,
  INotificationAction,
  IPatchUser,
  ItemSlot,
  TrackedStat,
} from '@interfaces';
import { AnalyticsService } from '@modules/content/analytics.service';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { NotificationService } from '@modules/notification/notification.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { sample } from 'lodash';

type ExploreResult =
  | 'Nothing'
  | 'Wave'
  | 'Item'
  | 'Discovery'
  | 'Collectible'
  | 'Resource';

const createFilledArray = (length: number, fill: ExploreResult) =>
  Array(length).fill(fill);

@Injectable()
export class GameplayService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly statsService: StatsService,
    private readonly inventoryService: InventoryService,
    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
    private readonly analyticsService: AnalyticsService,
    private readonly events: EventEmitter2,
    private readonly notificationService: NotificationService,
    private readonly playerHelper: PlayerHelperService,
  ) {}

  async explore(userId: string): Promise<Partial<IFullUser | IPatchUser>> {
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
          this.constantsService.wavePercentBoost +
            foundLocation.baseStats.wave || 0,
          'Wave',
        ),
        ...createFilledArray(
          this.constantsService.locationFindPercentBoost +
            foundLocation.baseStats.locationFind || 0,
          'Discovery',
        ),
        ...createFilledArray(
          this.constantsService.itemFindPercentBoost +
            foundLocation.baseStats.itemFind || 0,
          'Item',
        ),
        ...createFilledArray(
          this.constantsService.collectibleFindPercentBoost +
            foundLocation.baseStats.collectibleFind || 0,
          'Collectible',
        ),
        ...createFilledArray(
          this.constantsService.collectibleFindPercentBoost +
            foundLocation.baseStats.resourceFind || 0,
          'Resource',
        ),
      ];

      if (choices.length < 100) {
        const nothings = createFilledArray(100 - choices.length, 'Nothing');
        choices.push(...nothings);
      }

      exploreResult = sample(choices);

      this.analyticsService.sendDesignEvent(
        userId,
        `Gameplay:Explore:${foundLocation.name}:${exploreResult}`,
      );
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
        const xpGained = Math.floor(
          baseXp *
            (xpGainPercent / 100) *
            (this.constantsService.exploreXpMultiplier / 100),
        );

        this.playerHelper.gainXp(playerRef, xpGained);

        // gain coins
        const baseCoins = this.constantsService.baseExploreCoins;
        const coinsGainPercent = foundLocation.baseStats.coinGain;
        const coinsGained = Math.floor(baseCoins * (coinsGainPercent / 100));

        this.playerHelper.gainCoins(playerRef, coinsGained);

        // get cooldown
        const baseExploreSpeed = this.constantsService.baseExploreSpeed;
        const explorePercent = foundLocation.baseStats.exploreSpeed;
        const totalExploreSpeed = Math.max(
          1,
          baseExploreSpeed * (explorePercent / 100),
        );

        // reset explore action
        this.playerService.setPlayerAction(playerRef, undefined);

        const secondsAddedToCooldown = Math.floor(
          (this.constantsService.exploreSpeedMultiplier / 100) *
            totalExploreSpeed *
            1000,
        );

        // put explore on cooldown
        playerRef.location = {
          ...playerRef.location,
          cooldown: Date.now() + secondsAddedToCooldown,
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

        if (exploreResult === 'Resource') {
          await this.playerService.handleFindResource(playerRef, foundLocation);
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
          await this.discoveriesService.handleExploreDiscoveries(
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
  ): Promise<Partial<IFullUser | IPatchUser>> {
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

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:Walk:${location.name}`,
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

    return { player: playerPatches };
  }

  async travelToLocation(
    userId: string,
    locationName: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
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

    if (!this.playerHelper.hasCoins(player, cost)) {
      throw new ForbiddenException(
        'You do not have enough coins to travel here!',
      );
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
      },
    );

    return { player: playerPatches };
  }

  async waveToPlayerFromExplore(
    userId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    if (!player.action) throw new ForbiddenException('Player has no action');

    return this.waveToPlayer(userId, player, player.action);
  }

  async waveToPlayerFromNotification(
    userId: string,
    notificationId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
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

    return { player: playerPatches };
  }

  async takeItem(userId: string): Promise<Partial<IFullUser | IPatchUser>> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found');

    const inventoryPatches = await getPatchesAfterPropChanges<Inventory>(
      inventory,
      async (inventoryRef) => {
        const item: IItem = player.action?.actionData.item;
        if (!item) return;

        if (player.action?.action === 'resource') {
          inventoryRef.resources = {
            ...(inventoryRef.resources || {}),
            [item.itemId]: (inventoryRef.resources?.[item.itemId] ?? 0) + 1,
          };
        } else {
          await this.inventoryService.acquireItem(userId, item.itemId);
        }
      },
    );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        const item: IItem = player.action?.actionData.item;
        if (!item) return;

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

    return { player: playerPatches, inventory: inventoryPatches };
  }

  async sellItem(
    userId: string,
    instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    if (!instanceId) throw new ForbiddenException('Item instance not found!');

    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const itemRef = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!itemRef) throw new ForbiddenException('Item ref not found!');

    const item = this.contentService.getItem(itemRef.itemId);
    if (!item) throw new ForbiddenException('Item existence not found!');

    const coinsGained = itemValue(item);
    await this.inventoryService.removeInventoryItemForUser(userId, instanceId);

    this.analyticsService.sendDesignEvent(userId, `Item:Sell:${item.itemId}`);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinsGained);
      },
    );

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You sold ${
            item.name
          } for ${coinsGained.toLocaleString()} coins!`,
        },
      ],
    };
  }

  async equipItem(
    userId: string,
    equipmentSlot: ItemSlot,
    instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found.');

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new ForbiddenException('Item not found.');

    const itemRef = await this.contentService.getItem(item.itemId);
    if (!itemRef) throw new ForbiddenException('Item not found.');

    const job = await this.contentService.getJob(player.job);
    if (!job) throw new ForbiddenException('Job not found.');

    if (
      !job.armorSlots[itemRef.type] &&
      !job.weapons[itemRef.type] &&
      !['accessory1', 'accessory2', 'accessory3'].includes(equipmentSlot)
    )
      throw new ForbiddenException('Invalid equipment slot.');

    if (player.level < (itemRef as IEquipment).levelRequirement ?? 0)
      throw new ForbiddenException(
        'You are not high enough level to equip this item.',
      );

    let realSlotForItem = itemSlotForItem(itemRef);
    if (
      realSlotForItem === 'accessory' &&
      ['accessory1', 'accessory2', 'accessory3'].includes(equipmentSlot)
    ) {
      realSlotForItem = equipmentSlot;
    }

    const existingInstance = inventory.equippedItems[equipmentSlot];
    if (existingInstance) {
      await this.unequipItem(
        userId,
        equipmentSlot,
        existingInstance.instanceId ?? '',
      );
    }

    item.isInUse = true;

    const inventoryPatches = await getPatchesAfterPropChanges<Inventory>(
      inventory,
      async (inventoryRef) => {
        inventoryRef.equippedItems = {
          ...inventoryRef.equippedItems,
          [equipmentSlot]: {
            ...itemRef,
            ...item,
          },
        };
      },
    );

    return {
      inventory: inventoryPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You equipped ${itemRef.name} Lv.${
            (itemRef as IEquipment).levelRequirement ?? 0
          }!`,
        },
      ],
    };
  }

  async unequipItem(
    userId: string,
    equipmentSlot: ItemSlot,
    instanceId: string,
  ) {
    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new ForbiddenException('Item not found.');

    item.isInUse = false;
    inventory.equippedItems = {
      ...inventory.equippedItems,
      [equipmentSlot]: undefined,
    };
  }
}