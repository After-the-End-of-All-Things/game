import { IUser } from '../../../shared/interfaces';

export interface IUserStore {
  version: number;
  user: IUser;
}
