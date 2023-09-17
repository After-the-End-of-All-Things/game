import { IEquipment, IInventory, ItemSlot } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Inventory implements IInventory {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;
  @Unique()
  @Property({ hidden: true })
  userId: string;
  @Property()
  equippedItems: Record<ItemSlot, IEquipment | undefined>;
  @Property()
  otherJobEquipment: Record<string, Record<ItemSlot, IEquipment | undefined>>;
  @Property()
  resources: Record<string, number>;
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(userId: string) {
    this.userId = userId;

    this.equippedItems = {
      body: undefined,
      feet: undefined,
      head: undefined,
      legs: undefined,
      shoulders: undefined,
      waist: undefined,
      weapon: undefined,
      accessory1: undefined,
      accessory2: undefined,
      accessory3: undefined,
    };

    this.otherJobEquipment = {};

    this.resources = {};
  }
}
