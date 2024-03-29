import { IStats, TrackedStat } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Discoveries } from '@modules/discoveries/discoveries.schema';

@Entity()
export class Stats implements IStats {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Unique()
  @Property({ hidden: true })
  userId: string;

  @Property()
  location: string;

  @Property()
  name: string;

  @Property()
  discriminator: string;

  @Property()
  portrait: number;

  @Property()
  level: number;

  @Property()
  job: string;

  @Property()
  discoveries: Partial<Record<keyof Discoveries, number>>;

  @Property()
  stats: Partial<Record<TrackedStat, number>>;

  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(userId: string) {
    this.userId = userId;

    this.location = '';
    this.name = '';
    this.job = '';
    this.discriminator = '';
    this.portrait = -1;
    this.level = 1;

    this.discoveries = {};

    this.stats = {};
  }
}
