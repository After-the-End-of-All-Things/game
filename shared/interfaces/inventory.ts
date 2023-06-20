export type ItemSlot =
  | 'body'
  | 'feet'
  | 'head'
  | 'legs'
  | 'shoulders'
  | 'waist'
  | 'accessory1'
  | 'accessory2'
  | 'accessory3'
  | 'weapon';

export interface IInventory {
  equippedItems: Record<ItemSlot, string | undefined>;
}

export interface IInventoryItem {
  itemId: string;
  instanceId: string;
}
