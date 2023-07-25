import { INotification } from '../interfaces';

export function isNotificationLive(notif: INotification) {
  return new Date(notif.liveAt).getTime() <= Date.now();
}
