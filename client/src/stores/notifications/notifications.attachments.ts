import { IAttachment } from '../../interfaces';
import {
  AddNotification,
  ClearNotificationActions,
  MarkAllNotificationsRead,
  MarkNotificationRead,
  Notify,
  SetNotifications,
} from './notifications.actions';
import {
  addNotification,
  clearActions,
  markAllRead,
  markRead,
  notify,
  setNotifications,
} from './notifications.functions';

export const attachments: IAttachment[] = [
  { action: SetNotifications, handler: setNotifications },
  { action: MarkNotificationRead, handler: markRead },
  { action: MarkAllNotificationsRead, handler: markAllRead },
  { action: ClearNotificationActions, handler: clearActions },
  { action: AddNotification, handler: addNotification },
  { action: Notify, handler: notify },
];
