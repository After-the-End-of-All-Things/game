import { IAttachment } from '../../interfaces';
import {
  ApplyNotificationsPatches,
  MarkNotificationRead,
  SetNotifications,
} from './notifications.actions';
import {
  applyNotificationsPatches,
  markRead,
  setNotifications,
} from './notifications.functions';

export const attachments: IAttachment[] = [
  { action: SetNotifications, handler: setNotifications },
  { action: ApplyNotificationsPatches, handler: applyNotificationsPatches },
  { action: MarkNotificationRead, handler: markRead },
];
