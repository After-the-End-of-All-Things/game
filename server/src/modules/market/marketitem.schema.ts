import { IMarketItem, IMarketItemMeta } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class MarketItem implements IMarketItem {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Property()
  createdAt: Date;

  @Property({ hidden: true })
  userId: string;

  @Property()
  itemId: string;

  @Property()
  price: number;

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
    locality: string,
    meta: IMarketItemMeta,
  ) {
    this.createdAt = new Date();

    this.userId = userId;
    this.itemId = itemId;
    this.price = price;
    this.locality = locality;

    this.isSold = false;
    this.isClaimed = false;

    this.meta = meta;
  }
}
