import { IEquipment, ItemSlot, Stat, UserResponse } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryItem } from '@modules/inventory/inventoryitem.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateUUID } from '@utils/uuid';
import { Logger } from 'nestjs-pino';

@Injectable()
export class InventoryService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Inventory)
    private readonly inventory: EntityRepository<Inventory>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItems: EntityRepository<InventoryItem>,

    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
  ) {}

  async getInventoryForUser(userId: string): Promise<Inventory> {
    const inventory = await this.getOrCreateInventoryForUser(userId);
    if (!inventory) {
      throw new BadRequestException(`inventory id ${userId} not found.`);
    }

    return inventory;
  }

  private async getOrCreateInventoryForUser(
    userId: string,
  ): Promise<Inventory | undefined> {
    const dbInventory = await this.inventory.findOne({ userId });
    if (!dbInventory) {
      return await this.createInventoryForUser(userId);
    }

    return dbInventory;
  }

  async createInventoryForUser(userId: string): Promise<Inventory | undefined> {
    const inventory = new Inventory(userId);

    try {
      await this.inventory.create(inventory);
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException(`inventory id ${userId} already in use.`);
      }

      throw e;
    } finally {
      await this.em.flush();
    }

    return inventory;
  }

  async getInventoryItemsForUser(userId: string): Promise<UserResponse> {
    return { items: await this.inventoryItems.find({ userId }) };
  }

  async getInventoryItemForUser(
    userId: string,
    instanceId: string,
  ): Promise<InventoryItem> {
    const item = await this.inventoryItems.findOne({ userId, instanceId });
    if (!item) throw new NotFoundException(`Item ${instanceId} not found.`);

    return item;
  }

  async removeInventoryItemForUser(
    userId: string,
    instanceId: string,
  ): Promise<any> {
    const item = await this.getInventoryItemForUser(userId, instanceId);

    this.logger.verbose(
      `Removing item ${item.itemId} (${instanceId}) from ${userId}.`,
    );
    return this.em.remove<InventoryItem>(item);
  }

  async get(
    userId: string,
    instanceId: string,
  ): Promise<Partial<Record<Stat, number>>> {
    const item = await this.getInventoryItemForUser(userId, instanceId);

    const itemRef = this.contentService.getEquipment(item.itemId);
    return itemRef.stats ?? {};
  }

  async isInventoryFull(userId: string): Promise<boolean> {
    const count = await this.inventoryItems.count({
      userId,
      isInUse: { $ne: true },
    });

    return count >= this.constantsService.maxInventorySize;
  }

  async acquireItem(userId: string, itemId: string) {
    const itemRef = this.contentService.getItem(itemId);

    if (itemRef.type === 'resource') {
      await this.acquireResource(userId, itemId, 1);
      this.logger.error(
        new Error(
          `Erroneously attempting to acquire ${itemId} as an for ${userId}`,
        ),
      );
      return;
    }

    const item = new InventoryItem(userId, itemId, generateUUID());

    await this.inventoryItems.create(item);
    this.logger.verbose(`Acquiring item ${item.itemId} for ${userId}.`);
  }

  async hasResource(userId: string, resourceId: string, amount: number) {
    const inventory = await this.getInventoryForUser(userId);
    return inventory.resources[resourceId] >= amount;
  }

  async updateEquippedItem(userId: string, slot: ItemSlot, item: IEquipment) {
    const inventory = await this.getInventoryForUser(userId);

    inventory.equippedItems = {
      ...inventory.equippedItems,
      [slot]: item,
    };
  }

  acquireResourceForInventory(
    inventory: Inventory,
    userId: string,
    itemId: string,
    quantity = 1,
  ) {
    this.logger.verbose(
      `Acquiring resource x${quantity} ${itemId} for ${userId}.`,
    );
    inventory.resources = {
      ...(inventory.resources || {}),
      [itemId]: (inventory.resources?.[itemId] ?? 0) + quantity,
    };
  }

  async acquireResource(userId: string, itemId: string, quantity = 1) {
    const inventory = await this.getInventoryForUser(userId);

    const itemRef = this.contentService.getItem(itemId);

    if (itemRef.type !== 'resource') {
      await this.acquireItem(userId, itemId);
      this.logger.error(
        new Error(
          `Erroneously attempting to acquire ${itemId} as a resource for ${userId}`,
        ),
      );
      return;
    }

    this.acquireResourceForInventory(inventory, userId, itemId, quantity);
  }

  removeResourceForInventory(
    inventory: Inventory,
    userId: string,
    itemId: string,
    quantity = 1,
  ) {
    this.logger.verbose(
      `Removing resource x${quantity} ${itemId} for ${userId}.`,
    );
    inventory.resources = {
      ...(inventory.resources || {}),
      [itemId]: (inventory.resources?.[itemId] ?? 0) - quantity,
    };
  }

  async removeResource(userId: string, itemId: string, quantity = 1) {
    const inventory = await this.getInventoryForUser(userId);

    this.logger.verbose(
      `Removing resource x${quantity} ${itemId} for ${userId}.`,
    );
    this.removeResourceForInventory(inventory, userId, itemId, quantity);
  }

  async getEquipmentFor(
    userId: string,
  ): Promise<Record<ItemSlot, IEquipment | undefined>> {
    const inventory = await this.getInventoryForUser(userId);

    return inventory.equippedItems;
  }
}
