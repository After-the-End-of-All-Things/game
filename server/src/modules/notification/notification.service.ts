import { INotificationAction } from '@interfaces';
import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Notification } from '@modules/notification/notification.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Notification)
    private readonly notifications: EntityRepository<Notification>,
  ) {}

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return (await this.notifications.find({ userId })).reverse();
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
  ) {
    const notificationEntity = new Notification(
      userId,
      notification.text,
      notification.actions,
      notification.liveAt,
      expiresAfterHours,
    );

    this.em.persist(notificationEntity);

    await this.em.flush();
  }

  async markAllNotificationsRead(userId: string) {
    const notifs = await this.notifications.find({ userId });

    notifs.forEach((notif) => {
      notif.read = true;
    });
  }

  async markNotificationRead(notificationId: string) {
    const notif = await this.notifications.findOne({
      _id: new ObjectId(notificationId),
    });
    if (!notif) return;

    notif.read = true;
  }
}
