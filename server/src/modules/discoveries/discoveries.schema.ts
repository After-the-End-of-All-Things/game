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
  collectibles: Record<string, number>;

  @Property()
  monsters: Record<string, number>;

  @Property()
  items: Record<string, number>;

  @Property()
  uniqueCollectibleClaims: number;

  @Property()
  totalCollectibleClaims: number;

  @Property()
  uniqueEquipmentClaims: number;

  @Property()
  totalEquipmentClaims: number;

  @Property()
  uniqueMonsterClaims: number;

  @Property()
  totalMonsterClaims: number;

  constructor(userId: string) {
    this.userId = userId;

    this.locations = { Mork: true };
    this.portraits = { 4: true };
    this.backgrounds = { 0: true };
    this.borders = { 0: true };
    this.collectibles = {};
    this.items = {};
    this.monsters = {};

    this.uniqueCollectibleClaims = 0;
    this.totalCollectibleClaims = 0;
    this.uniqueEquipmentClaims = 0;
    this.totalEquipmentClaims = 0;
    this.uniqueMonsterClaims = 0;
    this.totalMonsterClaims = 0;
  }
}
