import { IEquipment, ItemSlot } from './item';

export interface IInventory {
  equippedItems: Record<ItemSlot, IEquipment | undefined>;
  otherJobEquipment: Record<string, Record<ItemSlot, IEquipment | undefined>>;
  resources: Record<string, number>;
}

export interface IInventoryItem {
  itemId: string;
  instanceId: string;
}
