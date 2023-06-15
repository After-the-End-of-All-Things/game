import { INotificationsStore } from '@interfaces';

export const notificationsStoreMigrations = [
  {
    version: 0,
    migrate: (state: INotificationsStore) => ({
      ...state,
      version: 1,
    }),
  },
].map((x) => ({ ...x, key: 'notifications' }));
