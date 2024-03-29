import {
  Currency,
  INotificationAction,
  IPlayer,
  IPlayerCosmetics,
  IPlayerLocation,
  IPlayerProfile,
  OOCBuff,
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
  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Unique()
  @Property()
  userId: string;

  @Property()
  xp: number;

  @Property()
  level: number;

  @Property()
  job: string;

  @Property()
  otherJobLevels: Record<string, number>;

  @Property()
  otherJobXp: Record<string, number>;

  @Property()
  stats: Record<Stat, number>;

  @Property()
  attackElements: Element[];

  @Property()
  defenseElements: Element[];

  @Property()
  recharges: Record<RechargeableStat, number>;

  @Property()
  currencies: Record<Currency, number>;

  @Property()
  location: IPlayerLocation;

  @Property()
  action: INotificationAction | undefined;

  @Property()
  profile: IPlayerProfile;

  @Property()
  cosmetics: IPlayerCosmetics;

  @Property()
  deityPrayerCooldown: number;

  @Property()
  deityBuffs: Record<OOCBuff, number>;

  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(userId: string) {
    this.userId = userId;

    this.xp = 0;
    this.level = 1;
    this.job = 'Generalist';

    this.otherJobLevels = {};
    this.otherJobXp = {};

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
      oats: 0,
    };

    this.location = {
      current: 'Mork',
      goingTo: '',
      arrivesAt: 0,
      cooldownStart: 0,
      cooldown: 0,
    };

    this.profile = {
      displayName: '',
      discriminator: '',
      shortBio: '',
      longBio: '',
    };

    this.cosmetics = {
      portrait: 4,
      background: -1,
      showcase: {
        collectibles: [],
        items: [],
      },
    };

    this.action = {
      text: '',
      action: '',
      actionData: {},
    };

    this.attackElements = [];
    this.defenseElements = [];

    this.deityPrayerCooldown = 0;
    this.deityBuffs = {
      coins: 0,
      xp: 0,
      travel: 0,
      offense: 0,
      defense: 0,
      nothing: 0,
    };
  }
}
