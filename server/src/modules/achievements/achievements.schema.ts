import { IAchievements } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Achievements implements IAchievements {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ hidden: true })
  userId: string;

  @Property()
  achievements: Record<string, number>;

  constructor(userId: string) {
    this.userId = userId;
  }
}
