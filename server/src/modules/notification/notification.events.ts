import { INotificationAction } from '@interfaces';
import { NotificationService } from '@modules/notification/notification.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationEventService {
  constructor(
    private readonly notifications: NotificationService,
    private events: EventEmitter2,
  ) {}

  @OnEvent('notification.create')
  async createNotification(event: {
    userId: string;
    notification: {
      text: string;
      liveAt: Date;
      actions: INotificationAction[];
    };
    expiresAfterHours: number;
  }) {
    const notification = await this.notifications.createNotificationForUser(
      event.userId,
      event.notification,
      event.expiresAfterHours,
    );

    this.events.emit('userdata.send', {
      userId: event.userId,
      data: {
        actions: [{ type: 'AddNotification', notification }],
      },
    });
  }
}
