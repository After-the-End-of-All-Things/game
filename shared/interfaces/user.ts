export interface IUser {
  id: string;
  createdAt: Date;
  discriminator: string;
  email: string;
  username: string;
}
