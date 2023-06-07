
export interface IUser {
  createdAt: number;
  discriminator: string;
  email: string;
  username: string;
}

export interface IUserStore {
  version: number;
  user: IUser;
}
