import { IEquipment, ItemSlot, Stat, UserResponse } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryItem } from '@modules/inventory/inventoryitem.schema';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class InventoryService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Inventory)
    private readonly inventory: EntityRepository<Inventory>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItems: EntityRepository<InventoryItem>,

    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
  ) {}

  async getInventoryForUser(userId: string): Promise<Inventory | undefined> {
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
      await this.em.flush();
    } catch (e) {
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('inventory id already in use.');
      }
    }

    return inventory;
  }

  async getInventoryItemsForUser(userId: string): Promise<UserResponse> {
    return { items: await this.inventoryItems.find({ userId }) };
  }

  async getInventoryItemForUser(
    userId: string,
    instanceId: string,
  ): Promise<InventoryItem | null> {
    return this.inventoryItems.findOne({ userId, instanceId });
  }

  async removeInventoryItemForUser(
    userId: string,
    instanceId: string,
  ): Promise<any> {
    const item = await this.getInventoryItemForUser(userId, instanceId);
    if (!item) return;

    return this.em.remove<InventoryItem>(item);
  }

  async get(
    userId: string,
    instanceId: string,
  ): Promise<Partial<Record<Stat, number>>> {
    const item = await this.getInventoryItemForUser(userId, instanceId);
    if (!item) throw new ForbiddenException('Item not found.');

    const itemRef = this.contentService.getEquipment(item.itemId);
    if (!itemRef) return {};

    return itemRef.stats;
  }

  async isInventoryFull(userId: string): Promise<boolean> {
    const count = await this.inventoryItems.count({
      userId,
      isInUse: { $ne: true },
    });

    return count >= this.constantsService.maxInventorySize;
  }

  async acquireItem(userId: string, itemId: string) {
    const item = new InventoryItem(userId, itemId, uuid());

    await this.inventoryItems.create(item);
  }

  async hasResource(userId: string, resourceId: string, amount: number) {
    const inventory = await this.getInventoryForUser(userId);
    if (!inventory) return;

    return inventory.resources[resourceId] > amount;
  }

  async updateEquippedItem(userId: string, slot: ItemSlot, item: IEquipment) {
    const inventory = await this.getInventoryForUser(userId);
    if (!inventory) return;

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
    inventory.resources = {
      ...(inventory.resources || {}),
      [itemId]: (inventory.resources?.[itemId] ?? 0) + quantity,
    };
  }

  async acquireResource(userId: string, itemId: string, quantity = 1) {
    const inventory = await this.getInventoryForUser(userId);
    if (!inventory) return;

    this.acquireResourceForInventory(inventory, userId, itemId, quantity);
  }

  removeResourceForInventory(
    inventory: Inventory,
    userId: string,
    itemId: string,
    quantity = 1,
  ) {
    inventory.resources = {
      ...(inventory.resources || {}),
      [itemId]: (inventory.resources?.[itemId] ?? 0) - quantity,
    };
  }

  async removeResource(userId: string, itemId: string, quantity = 1) {
    const inventory = await this.getInventoryForUser(userId);
    if (!inventory) return;

    this.removeResourceForInventory(inventory, userId, itemId, quantity);
  }

  async getEquipmentFor(
    userId: string,
  ): Promise<Record<ItemSlot, IEquipment | undefined>> {
    const inventory = await this.getInventoryForUser(userId);
    if (!inventory) throw new ForbiddenException('Inventory not found.');

    return inventory.equippedItems;
  }
}
