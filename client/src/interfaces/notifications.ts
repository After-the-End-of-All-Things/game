import { INotification } from '@interfaces';

export interface INotificationsStore {
  version: number;
  notifications: INotification[];
}
