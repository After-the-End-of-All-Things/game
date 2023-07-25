import { ICrafting, RecipeType } from '../interfaces';

export function getCraftingXp(crafting: ICrafting, type: RecipeType): number {
  const xpKey = `${type}Xp`;
  const currentXpValue: number = (crafting[xpKey] ?? 0) as number;

  return currentXpValue;
}

export function getCraftingLevel(
  crafting: ICrafting,
  type: RecipeType,
): number {
  const levelKey = `${type}Level`;
  const currentLevelValue: number = (crafting[levelKey] ?? 1) as number;

  return currentLevelValue;
}
