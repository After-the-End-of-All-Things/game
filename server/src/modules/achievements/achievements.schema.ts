import { IAchievements } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Achievements implements IAchievements {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Unique()
  @Property({ hidden: true })
  userId: string;

  @Property()
  achievements: Record<string, number>;

  constructor(userId: string) {
    this.userId = userId;

    this.achievements = {};
  }
}
