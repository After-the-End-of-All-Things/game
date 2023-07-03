import { INotificationAction } from '@interfaces';
import { NotificationService } from '@modules/notification/notification.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationEventService {
  constructor(private readonly notifications: NotificationService) {}

  @OnEvent('notification.create')
  createNotification(event: {
    userId: string;
    notification: {
      text: string;
      liveAt: Date;
      actions: INotificationAction[];
    };
    expiresAfterHours: number;
  }) {
    console.log('create notification', event);
    void this.notifications.createNotificationForUser(
      event.userId,
      event.notification,
      event.expiresAfterHours,
    );
  }
}
