import { INotification, INotificationAction } from '@interfaces';
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
export class Notification implements INotification {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Index()
  @Property({ hidden: true })
  userId: string;

  @Index()
  @Property()
  internalId: string;

  @Property()
  createdAt: Date;

  @Property()
  liveAt: Date;

  @Property()
  read: boolean;

  @Property()
  @Index({ options: { expireAfterSeconds: 0 } })
  expiresAt: Date;

  @Property()
  text: string;

  @Property()
  actions?: INotificationAction[];

  constructor(
    userId: string,
    text: string,
    actions: INotificationAction[] = [],
    liveAt = new Date(),
    expiresAfterHours = 24,
  ) {
    this.internalId = uuid();

    this.userId = userId;
    this.text = text;
    this.actions = actions;

    if (this.actions) {
      this.actions.forEach((action) => {
        if (!action.url) return;

        action.url = `${action.url}/${this.internalId}`;
      });
    }

    this.read = false;

    this.liveAt = liveAt;
    this.createdAt = new Date();
    this.expiresAt = new Date();

    this.expiresAt.setHours(this.expiresAt.getHours() + expiresAfterHours);
  }
}
