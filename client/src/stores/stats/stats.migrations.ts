import { IStatsStore } from '@interfaces';

export const statsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IStatsStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'stats' }));
