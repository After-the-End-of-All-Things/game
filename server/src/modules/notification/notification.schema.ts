import { INotification, INotificationAction } from '@interfaces';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Notification implements INotification {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ hidden: true })
  userId: string;

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
    expiresAfterHours = 24 * 7,
  ) {
    this._id = new ObjectId();

    this.userId = userId;
    this.text = text;
    this.actions = actions;

    if (this.actions) {
      this.actions.forEach((action) => {
        if (!action.url) return;

        action.url = `${action.url}/${this.id}`;
      });
    }

    this.read = false;

    this.liveAt = liveAt;
    this.createdAt = new Date();
    this.expiresAt = new Date();

    this.expiresAt.setHours(this.expiresAt.getHours() + expiresAfterHours);
  }
}
