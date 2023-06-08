import { IUser } from '@interfaces';

export interface IUserStore {
  version: number;
  user: IUser;
}
