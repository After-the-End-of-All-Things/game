import { IOptionsStore } from '@interfaces';

export const optionsStoreMigrations = [
  {
    version: 0,
    migrate: (state: IOptionsStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'options' }));
