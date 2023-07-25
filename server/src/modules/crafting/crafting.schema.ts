import { ICrafting } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Crafting implements ICrafting {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Unique()
  @Property({ hidden: true })
  userId: string;

  @Property()
  armorerLevel: number;

  @Property()
  armorerXp: number;

  @Property()
  artisanLevel: number;

  @Property()
  artisanXp: number;

  @Property()
  smithLevel: number;

  @Property()
  smithXp: number;

  @Property()
  currentlyCrafting: string;

  @Property()
  currentlyCraftingDoneAt: number;

  constructor(userId: string) {
    this.userId = userId;

    this.armorerLevel = 1;
    this.armorerXp = 0;

    this.artisanLevel = 1;
    this.artisanXp = 0;

    this.smithLevel = 1;
    this.smithXp = 0;

    this.currentlyCrafting = '';
    this.currentlyCraftingDoneAt = 0;
  }
}
