import { isNotificationLive } from '@helpers/notifications';
import {
  IAttachmentHelpers,
  INotification,
  INotificationsStore,
} from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { uniqBy } from 'lodash';
import {
  AddNotification,
  ClearNotificationActions,
  ClearNotificationActionsMatchingUrl,
  MarkNotificationRead,
  Notify,
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

export function markAllRead(ctx: StateContext<INotificationsStore>) {
  const currentNotifications = ctx.getState().notifications;
  currentNotifications.forEach((notification) => {
    if (!isNotificationLive(notification)) return;

    notification.read = true;
  });

  ctx.patchState({ notifications: currentNotifications });
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

export function clearActionsMatchingUrl(
  ctx: StateContext<INotificationsStore>,
  { url }: ClearNotificationActionsMatchingUrl,
) {
  const currentNotifications = ctx.getState().notifications;
  const filteredNotifications = currentNotifications.filter((n) => {
    return !n.actions?.some((a) => a.url?.includes(url));
  });

  ctx.patchState({ notifications: filteredNotifications });
}

export function addNotification(
  ctx: StateContext<INotificationsStore>,
  { notification }: AddNotification,
) {
  const currentNotifications = ctx.getState().notifications;
  const allNotifications = [notification, ...currentNotifications];

  const splicedNotifications = uniqBy(allNotifications, 'id');

  ctx.patchState({ notifications: splicedNotifications });
}

export function notify(
  ctx: StateContext<INotificationsStore>,
  { message, messageType }: Notify,
  helpers: IAttachmentHelpers | undefined,
) {
  helpers?.notify.showToast(message, messageType);
}
