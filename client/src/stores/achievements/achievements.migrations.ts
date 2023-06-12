import { IAchievementsStore } from '@interfaces';

export const achievementsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IAchievementsStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'achievements' }));
