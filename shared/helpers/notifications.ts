import { INotification } from '../interfaces';

export function isNotificationLive(notif: INotification) {
  return new Date(notif.liveAt).getTime() <= Date.now();
}

export function isNotificationExpired(notif: INotification) {
  return new Date(notif.expiresAt).getTime() <= Date.now();
}
