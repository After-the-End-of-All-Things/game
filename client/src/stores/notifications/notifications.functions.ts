import { INotification, INotificationsStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { applyPatch } from 'fast-json-patch';
import { uniqBy } from 'lodash';
import {
  ApplyNotificationsPatches,
  ClearNotificationActions,
  MarkNotificationRead,
  SetNotifications,
} from './notifications.actions';

export const defaultStore: () => INotificationsStore = () => ({
  version: 0,
  notifications: [],
});

export function setNotifications(
  ctx: StateContext<INotificationsStore>,
  { notifications }: SetNotifications,
) {
  const currentNotifications = ctx.getState().notifications;
  const allNotifications = [...notifications, ...currentNotifications];

  const splicedNotifications = uniqBy(allNotifications, 'id');

  ctx.patchState({ notifications: splicedNotifications });
}

export function applyNotificationsPatches(
  ctx: StateContext<INotificationsStore>,
  { patches }: ApplyNotificationsPatches,
) {
  const notifications = ctx.getState().notifications;

  applyPatch(notifications, patches);

  ctx.patchState({ notifications });
}

export function markRead(
  ctx: StateContext<INotificationsStore>,
  { id }: MarkNotificationRead,
) {
  ctx.setState(
    patch<INotificationsStore>({
      notifications: updateItem<INotification>(
        (n) => n.id === id,
        patch<INotification>({ read: true }),
      ),
    }),
  );
}

export function clearActions(
  ctx: StateContext<INotificationsStore>,
  { id }: ClearNotificationActions,
) {
  ctx.setState(
    patch<INotificationsStore>({
      notifications: updateItem<INotification>(
        (n) => n.id === id,
        patch<INotification>({ actions: [] }),
      ),
    }),
  );
}
