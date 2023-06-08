import { IPlayerStore } from '../../interfaces';

export const playerStoreMigrations = [
  {
    version: 0,
    migrate: (state: IPlayerStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'player' }));
