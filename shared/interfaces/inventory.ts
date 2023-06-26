import { IEquipment, ItemSlot } from '@interfaces';

export interface IInventory {
  equippedItems: Record<ItemSlot, IEquipment | undefined>;
}

export interface IInventoryItem {
  itemId: string;
  instanceId: string;
}
