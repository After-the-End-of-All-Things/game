import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class UserVerification {
  @SerializedPrimaryKey()
  id!: string;

  @Unique()
  @Property()
  email: string;

  @Property({ hidden: true })
  verificationCode: string;

  @Property({ hidden: true })
  @Index({ options: { expireAfterSeconds: 0 } })
  verificationExpiration: Date;

  @PrimaryKey()
  _id!: ObjectId;

  constructor(
    email: string,
    verificationCode: string,
    verificationExpirationHours: number,
  ) {
    this.email = email;
    this.verificationCode = verificationCode;

    this.verificationExpiration = new Date();
    this.verificationExpiration.setHours(
      this.verificationExpiration.getHours() + verificationExpirationHours,
    );
  }
}
