import { getCraftingLevel, getCraftingXp } from '@helpers/crafting';
import { itemSlotForItem, itemValue } from '@helpers/item';
import { xpForCraftingLevel, xpGainedForCraftingItem } from '@helpers/xp';
import {
  IEquipment,
  IItem,
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
import { FightService } from '@modules/fight/fight.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { NotificationService } from '@modules/notification/notification.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ItemService {
  constructor(
    private readonly logger: Logger,
    private readonly playerService: PlayerService,
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

  async takeItem(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found');

    const isResource = player.action?.action === 'resource';

    if (!isResource && (await this.inventoryService.isInventoryFull(userId))) {
      throw new BadRequestException('Inventory is full.');
    }

    const inventoryPatches = await getPatchesAfterPropChanges<Inventory>(
      inventory,
      async (inventoryRef) => {
        const item: IItem = player.action?.actionData.item;
        if (!item) return;

        if (isResource) {
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
