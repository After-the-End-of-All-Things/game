import { IAttachment } from '../../interfaces';
import {
  AddNotification,
  ClearNotificationActions,
  MarkNotificationRead,
  Notify,
  SetNotifications,
} from './notifications.actions';
import {
  addNotification,
  clearActions,
  markRead,
  notify,
  setNotifications,
} from './notifications.functions';

export const attachments: IAttachment[] = [
  { action: SetNotifications, handler: setNotifications },
  { action: MarkNotificationRead, handler: markRead },
  { action: ClearNotificationActions, handler: clearActions },
  { action: AddNotification, handler: addNotification },
  { action: Notify, handler: notify },
];
