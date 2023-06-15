import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { INotificationsStore } from '@interfaces';
import { defaultStore } from './notifications.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './notifications.attachments';

@State<INotificationsStore>({
  name: 'notifications',
  defaults: defaultStore(),
})
@Injectable()
export class NotificationsStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(NotificationsStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static notifications(state: INotificationsStore) {
    return state.notifications;
  }

  @Selector()
  static notificationCount(state: INotificationsStore) {
    return state.notifications.filter((n) => !n.read).length;
  }
}
