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
export class DailyRandomLottery {
  @SerializedPrimaryKey({ hidden: true })
  id!: string;
  @Property()
  internalId: string;
  @Index()
  @Property()
  createdAt: Date;
  @Property()
  winnerId: string;
  @Property()
  claimed: boolean;
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(winnerId: string) {
    this.createdAt = new Date();
    this.internalId = generateUUID();

    this.winnerId = winnerId;
    this.claimed = false;
  }
}
