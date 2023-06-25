import { IDiscoveries } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Discoveries implements IDiscoveries {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Unique()
  @Property({ hidden: true })
  userId: string;

  @Property()
  locations: Record<string, boolean>;

  @Property()
  portraits: Record<string, boolean>;

  @Property()
  backgrounds: Record<string, boolean>;

  @Property()
  borders: Record<string, boolean>;

  @Property()
  collectibles: Record<string, boolean>;

  @Property()
  items: Record<string, boolean>;

  constructor(userId: string) {
    this.userId = userId;

    this.locations = { Mork: true };
    this.portraits = {
      1: true,
      2: true,
      4: true,
      5: true,
      6: true,
      16: true,
      17: true,
      18: true,
      50: true,
      64: true,
      101: true,
    };
    this.backgrounds = { 0: true };
    this.borders = { 0: true };
    this.collectibles = {};
    this.items = {};
  }
}
