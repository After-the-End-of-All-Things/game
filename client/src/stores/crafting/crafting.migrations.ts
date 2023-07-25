import { ICraftingStore } from '@interfaces';

export const craftingStoreMigrations = [
  {
    version: 0,
    migrate: (state: ICraftingStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'crafting' }));
