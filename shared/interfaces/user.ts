export interface IUser {
  createdAt: Date;
  discriminator: string;
  email: string;
  username: string;
}
