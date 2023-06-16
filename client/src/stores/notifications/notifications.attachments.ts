import { IAttachment } from '../../interfaces';
import {
  ApplyNotificationsPatches,
  ClearNotificationActions,
  MarkNotificationRead,
  SetNotifications,
} from './notifications.actions';
import {
  applyNotificationsPatches,
  clearActions,
  markRead,
  setNotifications,
} from './notifications.functions';

export const attachments: IAttachment[] = [
  { action: SetNotifications, handler: setNotifications },
  { action: ApplyNotificationsPatches, handler: applyNotificationsPatches },
  { action: MarkNotificationRead, handler: markRead },
  { action: ClearNotificationActions, handler: clearActions },
];
