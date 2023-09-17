import { IMarketSale } from '@interfaces';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { generateUUID } from '@utils/uuid';

@Entity()
export class MarketSale implements IMarketSale {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Index()
  @Property()
  internalId: string;

  @Property()
  createdAt: Date;

  @Index()
  @Property({ hidden: true })
  seller: string;

  @Index()
  @Property({ hidden: true })
  buyer: string;

  @Index()
  @Property()
  itemId: string;

  @Property()
  price: number;

  @Property()
  quantity: number;

  @Property()
  locality: string;

  @Property()
  @Index({ options: { expireAfterSeconds: 0 } })
  expiresAt: Date;

  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(
    seller: string,
    buyer: string,
    itemId: string,
    price: number,
    quantity: number,
    locality: string,
    expiresAfterHours = 24 * 7,
  ) {
    this.createdAt = new Date();
    this.internalId = generateUUID();

    this.seller = seller;
    this.buyer = buyer;
    this.itemId = itemId;
    this.price = price;
    this.quantity = quantity ?? 1;
    this.locality = locality;

    this.expiresAt = new Date();
    this.expiresAt.setHours(this.expiresAt.getHours() + expiresAfterHours);
  }
}
