import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IUserStore } from '@interfaces';
import { defaultStore } from './user.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './user.attachments';

@State<IUserStore>({
  name: 'user',
  defaults: defaultStore(),
})
@Injectable()
export class UserStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(UserStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static user(state: IUserStore) {
    return state.user;
  }

  @Selector()
  static email(state: IUserStore) {
    return state.user.email;
  }

  @Selector()
  static emailVerified(state: IUserStore) {
    return state.user.emailVerified;
  }
}
