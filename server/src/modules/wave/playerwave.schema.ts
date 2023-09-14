import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class PlayerWave {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Index()
  @Property()
  playerWaving: string;

  @Index()
  @Property()
  playerWavingAt: string;

  @Property()
  @Index({ options: { expireAfterSeconds: 0 } })
  expiresAt: Date;

  constructor(
    playerWaving: string,
    playerWavingAt: string,
    expiresAfterHours = 12,
  ) {
    this.playerWaving = playerWaving;
    this.playerWavingAt = playerWavingAt;

    this.expiresAt = new Date();
    this.expiresAt.setHours(this.expiresAt.getHours() + expiresAfterHours);
  }
}
