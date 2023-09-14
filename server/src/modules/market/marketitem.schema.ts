import { IMarketItem, IMarketItemMeta } from '@interfaces';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { v4 as uuid } from 'uuid';

@Entity()
export class MarketItem implements IMarketItem {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Index()
  @Property()
  internalId: string;

  @Property()
  createdAt: Date;

  @Index()
  @Property({ hidden: true })
  userId: string;

  @Property()
  itemId: string;

  @Property()
  price: number;

  @Property()
  quantity: number;

  @Property()
  locality: string;

  @Property()
  isSold: boolean;

  @Property()
  isClaimed: boolean;

  @Property()
  meta: IMarketItemMeta;

  constructor(
    userId: string,
    itemId: string,
    price: number,
    quantity: number,
    locality: string,
    meta: IMarketItemMeta,
  ) {
    this.createdAt = new Date();
    this.internalId = uuid();

    this.userId = userId;
    this.itemId = itemId;
    this.price = price;
    this.quantity = quantity;
    this.locality = locality;

    this.isSold = false;
    this.isClaimed = false;

    this.meta = meta;
  }
}
