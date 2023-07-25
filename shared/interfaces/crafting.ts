export type RecipeType = 'armorer' | 'artisan' | 'smith';

export interface IRecipeItem {
  item: string;
  amount: number;
}

export interface IRecipe {
  resultingItem: string;
  requiredLevel: number;
  maxLevel: number;
  craftTime: number;
  type: RecipeType;
  ingredients: IRecipeItem[];
}

export interface ICrafting {
  armorerLevel: number;
  armorerXp: number;

  artisanLevel: number;
  artisanXp: number;

  smithLevel: number;
  smithXp: number;

  currentlyCrafting: string;
  currentlyCraftingDoneAt: number;
}
