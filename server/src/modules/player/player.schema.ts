import {
  Currency,
  IPlayer,
  IPlayerCosmetics,
  IPlayerLocation,
  IPlayerProfile,
  RechargeableStat,
  Stat,
} from '@interfaces';

import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';

import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Player implements IPlayer {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Unique()
  @Property({ hidden: true })
  userId: string;

  @Property()
  xp: number;

  @Property()
  level: number;

  @Property()
  stats: Record<Stat, number>;

  @Property()
  recharges: Record<RechargeableStat, number>;

  @Property()
  currencies: Record<Currency, number>;

  @Property()
  location: IPlayerLocation;

  @Property()
  profile: IPlayerProfile;

  @Property()
  cosmetics: IPlayerCosmetics;

  constructor(userId: string) {
    this.userId = userId;

    this.xp = 0;
    this.level = 1;

    this.stats = {
      health: 0,
      power: 0,
      toughness: 0,
      magic: 0,
      resistance: 0,
      special: 0,
    };

    this.recharges = {
      health: 0,
    };

    this.currencies = {
      coins: 0,
    };

    this.location = {
      current: 'Mork',
      goingTo: '',
      arrivesAt: 0,
    };

    this.profile = {
      shortBio: '',
      longBio: '',
    };

    this.cosmetics = {
      portrait: 4,
      background: 0,
    };
  }
}
