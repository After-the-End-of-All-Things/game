import { IUserStore } from '../../interfaces';

export const userStoreMigrations = [
  {
    version: 0,
    migrate: (state: IUserStore) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'user' }));
