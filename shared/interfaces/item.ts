import { Stat } from '@interfaces';

export type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Unusual'
  | 'Rare'
  | 'Masterful'
  | 'Arcane'
  | 'Epic'
  | 'Divine'
  | 'Unique';

export type Element = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark';

export type Armor = 'body' | 'feet' | 'head' | 'legs' | 'shoulders' | 'waist';

export type Weapon =
  | 'axe'
  | 'bow'
  | 'dagger'
  | 'fist'
  | 'gun'
  | 'mace'
  | 'spear'
  | 'staff'
  | 'sword';

export type Accessory = 'jewelry' | 'wrist' | 'hands' | 'ammo';

export type ItemType = Armor | Weapon | Accessory | 'collectible';

export interface IItem {
  name: string;
  itemId: string;
  instanceId?: string;
  rarity: Rarity;
  sprite: number;
  type: ItemType;
}

export interface ICollectible extends IItem {
  location: string;
}

export interface IEquipment extends IItem {
  stats: Record<Stat, number>;
  elements: Element[];
  levelRequirement: number;
}
