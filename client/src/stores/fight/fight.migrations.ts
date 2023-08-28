import { IFightStore } from '@interfaces';

export const fightStoreMigrations = [
  {
    version: 0,
    migrate: (state: IFightStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'fight' }));
