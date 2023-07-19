import {
  Accessory,
  AllAccessories,
  AllArmor,
  AllWeapons,
  Armor,
  IEquipment,
  IItem,
  ItemSlot,
  Rarity,
  Stat,
  Weapon,
} from '../interfaces/';

const multiplierPerRarity: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 1.25,
  Unusual: 1.75,
  Rare: 2.5,
  Masterful: 4,
  Epic: 6.5,
  Arcane: 9.5,
  Divine: 11,
  Unique: 13,
};

const valuePerStat: Record<Stat, number> = {
  health: 1,
  magic: 3,
  power: 5,
  resistance: 2,
  special: 10,
  toughness: 4,
};

export function itemValue(item: IItem): number {
  const levelRequirement = (item as IEquipment).levelRequirement ?? 1;
  const itemStats = (item as IEquipment).stats ?? {};

  let multiplier = 1;
  if (item.type === 'collectible') multiplier = 50;
  if (item.type === 'resource') multiplier = 25;

  let value = 1;

  Object.keys(itemStats).forEach((stat) => {
    const statValue =
      (itemStats[stat as Stat] ?? 0) * (valuePerStat[stat as Stat] ?? 0);
    value += statValue;
  });

  value *= multiplier;
  value *= multiplierPerRarity[item.rarity] ?? 1;
  value *= Math.log(levelRequirement + 1);

  return Math.max(1, Math.floor(value));
}

export function itemSlotForItem(
  item: IItem,
): ItemSlot | 'accessory' | undefined {
  const type = item.type;

  if (AllArmor.includes(type as Armor)) return type as Armor;
  if (AllWeapons.includes(type as Weapon)) return 'weapon';
  if (AllAccessories.includes(type as Accessory)) return 'accessory';

  return undefined;
}
