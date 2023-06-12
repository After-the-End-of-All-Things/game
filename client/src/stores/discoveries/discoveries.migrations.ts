import { IDiscoveriesStore } from '@interfaces';

export const discoveriesStoreMigrations = [
  {
    version: 0,
    migrate: (state: IDiscoveriesStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'discoveries' }));
