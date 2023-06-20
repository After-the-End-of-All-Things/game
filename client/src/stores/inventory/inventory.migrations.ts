import { IInventoryStore } from '@interfaces';

export const inventoryStoreMigrations = [
  {
    version: 0,
    migrate: (state: IInventoryStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'inventory' }));
