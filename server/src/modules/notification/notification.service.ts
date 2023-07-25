import { isNotificationLive } from '@helpers/notifications';
import { INotificationAction } from '@interfaces';
import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Notification } from '@modules/notification/notification.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent } from 'rxjs';
@Injectable()
export class NotificationService {
  private readonly events = new EventEmitter2();

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Notification)
    private readonly notifications: EntityRepository<Notification>,
  ) {}

  public subscribe(channel: string) {
    return fromEvent(this.events, channel);
  }

  public emit(channel: string, data: any = {}) {
    this.events.emit(channel, { data });
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return (await this.notifications.find({ userId })).reverse();
  }

  async getNotificationForUser(
    userId: string,
    notificationId: string,
  ): Promise<Notification | null> {
    return this.notifications.findOne({ userId, id: notificationId });
  }

  async getNotificationsForUserAfter(
    userId: string,
    after: Date,
  ): Promise<Notification[]> {
    return (
      await this.notifications.find({ userId, createdAt: { $gt: after } })
    ).reverse();
  }

  async createNotificationForUser(
    userId: string,
    notification: {
      text: string;
      liveAt: Date;
      actions: INotificationAction[];
    },
    expiresAfterHours = 24,
  ): Promise<Notification> {
    if (!userId)
      throw new BadRequestException('No user id provided for notification');

    const notificationEntity = new Notification(
      userId,
      notification.text,
      notification.actions,
      notification.liveAt,
      expiresAfterHours,
    );

    this.em.persist(notificationEntity);

    await this.em.flush();

    return notificationEntity;
  }

  async markAllNotificationsRead(userId: string) {
    const notifs = await this.notifications.find({ userId });

    notifs.forEach((notif) => {
      if (!isNotificationLive(notif)) return;
      notif.read = true;
    });
  }

  async clearAllNotificationActionsMatchingUrl(userId: string, url: string) {
    const notifs = await this.notifications.find({ userId });

    notifs.forEach((notif) => {
      if (!isNotificationLive(notif)) return;

      const actions = notif.actions ?? [];
      if (!actions.some((a) => a.url?.includes(url))) return;

      notif.actions = [];
    });
  }

  async markNotificationRead(notificationId: string) {
    const notif = await this.notifications.findOne({
      _id: new ObjectId(notificationId),
    });
    if (!notif) return;

    notif.read = true;
  }

  async clearNotificationActions(notificationId: string) {
    const notif = await this.notifications.findOne({
      _id: new ObjectId(notificationId),
    });
    if (!notif) return;

    notif.actions = [];
  }
}
