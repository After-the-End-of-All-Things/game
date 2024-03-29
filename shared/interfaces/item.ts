import { Element, Rarity, Stat } from './buildingblocks';

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

export type Accessory = 'jewelry' | 'wrist' | 'hands' | 'ammo' | 'back';

export type EquipmentType = Armor | Weapon | Accessory;

export type ItemType = EquipmentType | 'collectible' | 'resource';

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

export const AllArmor: Armor[] = [
  'body',
  'feet',
  'head',
  'legs',
  'shoulders',
  'waist',
];
export const AllWeapons: Weapon[] = [
  'axe',
  'bow',
  'dagger',
  'fist',
  'gun',
  'mace',
  'spear',
  'staff',
  'sword',
];
export const AllAccessories: Accessory[] = [
  'jewelry',
  'wrist',
  'hands',
  'ammo',
  'back',
];

export interface IItem {
  name: string;
  itemId: string;
  instanceId?: string;
  description: string;
  rarity: Rarity;
  sprite: number;
  type: ItemType;
}

export interface ICollectible extends IItem {
  location: string;
}

export interface IResource extends IItem {
  location: string;
}

export interface IEquipment extends IItem {
  stats: Record<Stat, number>;
  attackElements: Element[];
  defenseElements: Element[];
  levelRequirement: number;
  abilities: string[];
}
