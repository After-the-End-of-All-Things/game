import { IInventoryItem } from '@interfaces';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class InventoryItem implements IInventoryItem {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;
  @Index()
  @Property({ hidden: true })
  userId: string;
  @Property()
  itemId: string;
  @Property()
  instanceId: string;
  @Property()
  isInUse: boolean;
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(userId: string, itemId: string, instanceId: string) {
    this.userId = userId;
    this.itemId = itemId;
    this.instanceId = instanceId;
    this.isInUse = false;
  }
}
