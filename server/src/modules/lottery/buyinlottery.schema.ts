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
export class LotteryBuyInTicket {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Property()
  internalId: string;

  @Index()
  @Property()
  createdAt: Date;

  @Property()
  userId: string;

  @Property()
  ticketNumber: string;

  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(userId: string, ticketNumber: string) {
    this.createdAt = new Date();
    this.internalId = generateUUID();

    this.userId = userId;
    this.ticketNumber = ticketNumber;
  }
}
