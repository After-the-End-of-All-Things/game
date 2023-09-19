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
export class LotteryBuyInDraw {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Property()
  internalId: string;

  @Index()
  @Property()
  createdAt: Date;

  @Property()
  ticketNumber: string;

  @Property()
  claimed: boolean;

  @Property()
  winnerId: string;

  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(ticketNumber: string) {
    this.createdAt = new Date();
    this.internalId = generateUUID();

    this.ticketNumber = ticketNumber;
    this.claimed = false;
    this.winnerId = '';
  }
}
