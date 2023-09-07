import { getCraftingLevel, getCraftingXp } from '@helpers/crafting';
import { itemSlotForItem, itemValue } from '@helpers/item';
import { xpForCraftingLevel, xpGainedForCraftingItem } from '@helpers/xp';
import {
  IEquipment,
  IItem,
  ILocation,
  INotificationAction,
  ItemSlot,
  TrackedStat,
  UserResponse,
} from '@interfaces';
import { AnalyticsService } from '@modules/content/analytics.service';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { Crafting } from '@modules/crafting/crafting.schema';
import { CraftingService } from '@modules/crafting/crafting.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { FightService } from '@modules/fight/fight.service';
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
import { Logger } from 'nestjs-pino';

type ExploreResult =
  | 'Nothing'
  | 'Wave'
  | 'Item'
  | 'Discovery'
  | 'Collectible'
  | 'Resource'
  | 'Monster';

const createFilledArray = (length: number, fill: ExploreResult) =>
  Array(length).fill(fill);

@Injectable()
export class GameplayService {
  constructor(
    private readonly logger: Logger,
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly statsService: StatsService,
    private readonly inventoryService: InventoryService,
    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
    private readonly craftingService: CraftingService,
    private readonly analyticsService: AnalyticsService,
    private readonly events: EventEmitter2,
    private readonly notificationService: NotificationService,
    private readonly playerHelper: PlayerHelperService,
    private readonly fights: FightService,
  ) {}

  async explore(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const fight = await this.fights.getFightForUser(userId);
    if (fight) throw new ForbiddenException('Cannot explore while fighting');

    if (player.location.cooldown > Date.now())
      return { player: [], discoveries: [] };

    if (player.action?.actionData?.stopExplore) {
      throw new ForbiddenException("You can't explore right now!");
    }

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
          this.constantsService.resourceFindPercentBoost +
            foundLocation.baseStats.resourceFind || 0,
          'Resource',
        ),
        ...createFilledArray(
          this.constantsService.monsterFindPercentBoost +
            foundLocation.baseStats.monsterFind || 0,
          'Monster',
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

        if (exploreResult === 'Monster') {
          await this.playerService.handleFindMonster(playerRef, foundLocation);
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

    this.logger.verbose(
      `Explore result: ${exploreResult} for player ${userId} in ${player.location.current}.`,
    );

    await this.statsService.incrementStat(
      userId,
      'timesExplored' as TrackedStat,
      1,
    );

    return { player: playerPatches, discoveries: discoveriesPatches };
  }

  async walkToLocation(
    userId: string,
    locationName: string,
  ): Promise<UserResponse> {
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

    this.logger.verbose(`Player ${userId} is walking to ${locationName}.`);

    return { player: playerPatches };
  }

  async travelToLocation(
    userId: string,
    locationName: string,
  ): Promise<UserResponse> {
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

    this.logger.verbose(`Player ${userId} is traveling to ${locationName}.`);

    await this.statsService.incrementStat(
      userId,
      'timesTraveled' as TrackedStat,
      1,
    );

    return { player: playerPatches };
  }

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

  async takeItem(userId: string): Promise<UserResponse> {
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

    this.logger.verbose(
      `Player ${userId} took item ${player.action?.actionData.item.itemId}.`,
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

        await this.statsService.incrementStat(
          userId,
          'itemsFound' as TrackedStat,
          1,
        );

        this.analyticsService.sendDesignEvent(
          userId,
          `Gameplay:TakeItem:${player.location.current}:${item.name}`,
        );
      },
    );

    return {
      player: playerPatches,
      inventory: inventoryPatches,
      actions: [{ type: 'UpdateInventoryItems' }],
    };
  }

  async startFight(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const existingFight = await this.fights.getFightForUser(userId);
    if (existingFight)
      throw new ForbiddenException('Fight already in progress');

    const formationId = player.action?.actionData.formation.itemId;
    const formation = this.contentService.getFormation(formationId);
    if (!formation) throw new ForbiddenException('Formation not found');

    const fight = await this.fights.createPvEFightForSinglePlayer(
      player,
      formation,
    );
    if (!fight) throw new ForbiddenException('Fight not created');

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:StartFight:${player.location.current}:${formation.name}`,
    );

    return {
      fight,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You started a fight with ${formation.name}!`,
        },
        {
          type: 'ChangePage',
          newPage: 'combat',
        },
      ],
    };
  }

  async sellItem(userId: string, instanceId: string): Promise<UserResponse> {
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

    this.logger.verbose(`Player ${userId} sold item ${item.itemId}.`);

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:SellItem:${player.location.current}:${item.name}`,
    );

    await this.statsService.incrementStat(
      userId,
      'itemsSold' as TrackedStat,
      1,
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
        {
          type: 'RemoveInventoryItem',
          instanceId,
        },
      ],
    };
  }

  async equipItem(
    userId: string,
    equipmentSlot: ItemSlot,
    instanceId: string,
  ): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found.');

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    const fight = await this.fights.getFightForUser(userId);
    if (fight)
      throw new ForbiddenException('Cannot equip items while in combat.');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new ForbiddenException('Inventory item not found.');

    const itemRef = await this.contentService.getItem(item.itemId);
    if (!itemRef) throw new ForbiddenException('Item ref not found.');

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
    if (existingInstance && existingInstance.instanceId) {
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

    this.logger.verbose(`Player ${userId} equipped item ${item.itemId}.`);

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
  ): Promise<UserResponse> {
    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new ForbiddenException('Equipped item not found.');

    item.isInUse = false;
    inventory.equippedItems = {
      ...inventory.equippedItems,
      [equipmentSlot]: undefined,
    };

    this.logger.verbose(`Player ${userId} unequipped item ${item.itemId}.`);

    return {};
  }

  async craftItem(userId: string, itemId: string): Promise<UserResponse> {
    const crafting = await this.craftingService.getCraftingForUser(userId);
    if (!crafting) throw new ForbiddenException('Crafting not found.');

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    const recipe = this.contentService.getRecipe(itemId);
    if (!recipe) throw new ForbiddenException('Recipe not found.');

    const item = this.contentService.getItem(itemId);
    if (!item) throw new ForbiddenException('Craft item not found.');

    if (crafting.currentlyCrafting)
      throw new ForbiddenException('You are already crafting an item.');

    const currentLevelValue = getCraftingLevel(crafting, recipe.type);
    if (currentLevelValue < recipe.requiredLevel)
      throw new ForbiddenException(
        'You are not high enough level to craft this item.',
      );

    if (
      !this.craftingService.hasResourcesForRecipe(recipe, inventory.resources)
    ) {
      throw new ForbiddenException(
        'You do not have enough resources to craft this item.',
      );
    }

    const craftTime = recipe.craftTime;
    const timeMultiplier = this.constantsService.craftingSpeedMultiplier;

    const totalCraftTime = Math.floor(craftTime * (timeMultiplier / 100));
    const craftEndsAt = Date.now() + totalCraftTime * 1000;

    this.events.emit('notification.create', {
      userId,
      notification: {
        liveAt: new Date(craftEndsAt),
        text: `Your crafted ${item.name} has completed!`,
        actions: [
          {
            text: 'Collect',
            url: 'gameplay/item/craft/take',
            clearActionsForUrl: 'gameplay/item/craft/take',
          },
        ],
      },
      expiresAfterHours: 24,
    });

    const craftingPatches = await getPatchesAfterPropChanges<Crafting>(
      crafting,
      async (craftingRef) => {
        craftingRef.currentlyCrafting = recipe.resultingItem;
        craftingRef.currentlyCraftingDoneAt = craftEndsAt;
      },
    );

    const inventoryPatches = await getPatchesAfterPropChanges<Inventory>(
      inventory,
      async (inventoryRef) => {
        const newResources = this.craftingService.takeResourcesForRecipe(
          recipe,
          inventoryRef.resources,
        );
        inventoryRef.resources = { ...newResources };
      },
    );

    this.logger.verbose(
      `Player ${userId} started crafting item ${item.itemId}.`,
    );

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:CraftItem:${item.name}`,
    );

    return { inventory: inventoryPatches, crafting: craftingPatches };
  }

  async takeCraftedItem(userId: string): Promise<UserResponse> {
    const crafting = await this.craftingService.getCraftingForUser(userId);
    if (!crafting) throw new ForbiddenException('Crafting not found.');

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    const craftItem = crafting.currentlyCrafting;
    if (!craftItem) throw new ForbiddenException('Crafting item not found.');

    const recipe = this.contentService.getRecipe(craftItem);
    if (!recipe) throw new ForbiddenException('Recipe not found.');

    if (Date.now() < crafting.currentlyCraftingDoneAt)
      throw new ForbiddenException('Crafting not done yet.');

    const item = this.contentService.getItem(craftItem);
    if (!item) throw new ForbiddenException('Crafted item not found.');

    if (
      item.type !== 'resource' &&
      (await this.inventoryService.isInventoryFull(userId))
    )
      throw new ForbiddenException('Inventory is full.');

    const inventoryPatches = await getPatchesAfterPropChanges<Inventory>(
      inventory,
      async (inventoryRef) => {
        if (item.type === 'resource') {
          this.inventoryService.acquireResourceForInventory(
            inventoryRef,
            userId,
            craftItem,
          );
        } else {
          await this.inventoryService.acquireItem(userId, craftItem);
        }
      },
    );

    const craftingPatches = await getPatchesAfterPropChanges<Crafting>(
      crafting,
      async (craftingRef) => {
        craftingRef.currentlyCrafting = '';
        craftingRef.currentlyCraftingDoneAt = 0;

        const type = recipe.type;
        const xpKey = `${type}Xp`;
        const levelKey = `${type}Level`;

        const currentXpValue = getCraftingXp(craftingRef, type);
        const currentLevelValue = getCraftingLevel(craftingRef, type);

        if (currentLevelValue < recipe.maxLevel) {
          const nextLevelXp = xpForCraftingLevel(currentLevelValue);

          craftingRef[xpKey] = currentXpValue + xpGainedForCraftingItem(item);
          if (craftingRef[xpKey] >= nextLevelXp) {
            craftingRef[levelKey] = currentLevelValue + 1;
            craftingRef[xpKey] = craftingRef[xpKey] - nextLevelXp;
          }
        }
      },
    );

    await this.notificationService.clearAllNotificationActionsMatchingUrl(
      userId,
      'gameplay/item/craft/take',
    );

    this.logger.verbose(
      `Player ${userId} collected crafted item ${item.itemId}.`,
    );

    await this.statsService.incrementStat(
      userId,
      'itemsCrafted' as TrackedStat,
      1,
    );

    return {
      inventory: inventoryPatches,
      crafting: craftingPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You collected ${item.name}!`,
        },
      ],
    };
  }
}
