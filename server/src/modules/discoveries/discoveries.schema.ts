import { IDiscoveries } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Discoveries implements IDiscoveries {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ hidden: true })
  userId: string;

  @Property()
  locations: Record<string, boolean>;

  @Property()
  portraits: Record<string, boolean>;

  @Property()
  backgrounds: Record<string, boolean>;

  constructor(userId: string) {
    this.userId = userId;
  }
}
