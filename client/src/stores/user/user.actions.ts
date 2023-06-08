import { IUser } from '@interfaces';

export class SetUser {
  static type = '[User] Set';
  constructor(public user: IUser) {}
}
