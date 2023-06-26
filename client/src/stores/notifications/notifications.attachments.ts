import { IAttachment } from '../../interfaces';
import {
  ApplyNotificationsPatches,
  ClearNotificationActions,
  MarkNotificationRead,
  Notify,
  SetNotifications,
} from './notifications.actions';
import {
  applyNotificationsPatches,
  clearActions,
  markRead,
  notify,
  setNotifications,
} from './notifications.functions';

export const attachments: IAttachment[] = [
  { action: SetNotifications, handler: setNotifications },
  { action: ApplyNotificationsPatches, handler: applyNotificationsPatches },
  { action: MarkNotificationRead, handler: markRead },
  { action: ClearNotificationActions, handler: clearActions },
  { action: Notify, handler: notify },
];
