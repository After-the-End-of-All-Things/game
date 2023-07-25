import { IAttachment } from '../../interfaces';
import {
  AddNotification,
  ClearNotificationActions,
  ClearNotificationActionsMatchingUrl,
  MarkAllNotificationsRead,
  MarkNotificationRead,
  Notify,
  SetNotifications,
} from './notifications.actions';
import {
  addNotification,
  clearActions,
  clearActionsMatchingUrl,
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
  {
    action: ClearNotificationActionsMatchingUrl,
    handler: clearActionsMatchingUrl,
  },
  { action: AddNotification, handler: addNotification },
  { action: Notify, handler: notify },
];
