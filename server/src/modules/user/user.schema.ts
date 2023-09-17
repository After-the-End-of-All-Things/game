import { IUser } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { onlineUntilExpiration } from '../../utils/time';

export type UserId = User['_id'];

@Entity()
export class User implements IUser {
  @SerializedPrimaryKey()
  id!: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  createdAt: Date;

  @Property()
  onlineUntil: number;

  @Property()
  username: string;

  @Property()
  discriminator: string;

  @Unique()
  @Property()
  email: string;

  @PrimaryKey()
  _id!: ObjectId;

  constructor(
    username: string,
    discriminator: string,
    password: string,
    email: string,
  ) {
    this.username = username;
    this.discriminator = discriminator;
    this.password = password;
    this.email = email;
    this.createdAt = new Date();
    this.onlineUntil = onlineUntilExpiration();
  }
}
