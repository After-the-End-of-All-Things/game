import { IMarketStore } from '@interfaces';

export const marketStoreMigrations = [
  {
    version: 0,
    migrate: (state: IMarketStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'market' }));
