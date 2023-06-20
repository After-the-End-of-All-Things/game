import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryItem } from '@modules/inventory/inventoryitem.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
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
        throw new BadRequestException('discoveries id already in use.');
      }
    }

    return inventory;
  }

  async getInventoryItemsForUser(userId: string): Promise<InventoryItem[]> {
    return this.inventoryItems.find({ userId });
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
}
