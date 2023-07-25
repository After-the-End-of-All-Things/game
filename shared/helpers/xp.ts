import { IItem, Rarity } from '@interfaces';

export function xpForLevel(level: number): number {
  return (level + 1) * 15;
}

export function xpForCraftingLevel(level: number): number {
  return (level + 1) * 5;
}

export function xpGainedForCraftingItem(item: IItem): number {
  const xpsPerRarity: Record<Rarity, number> = {
    Common: 1,
    Uncommon: 2,
    Unusual: 3,
    Rare: 5,
    Masterful: 7,
    Arcane: 9,
    Epic: 11,
    Divine: 13,
    Unique: 15,
  };

  return xpsPerRarity[item.rarity] ?? 1;
}
