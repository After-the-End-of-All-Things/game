import { IEquipment, ItemSlot } from '@interfaces';

export interface IInventory {
  equippedItems: Record<ItemSlot, IEquipment | undefined>;
  resources: Record<string, number>;
}

export interface IInventoryItem {
  itemId: string;
  instanceId: string;
}
