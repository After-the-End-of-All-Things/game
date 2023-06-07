
import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IUserStore } from '../../interfaces';
import { defaultStore } from './user.functions';

import { attachments } from './user.attachments';

@State<IUserStore>({
  name: 'user',
  defaults: defaultStore()
})
@Injectable()
export class UserStore {

  constructor(
  ) {
    attachments.forEach(({ action, handler }) => {
      attachAction(UserStore, action, handler);
    });
  }

  @Selector()
  static user(state: IUserStore) {
    return state.user;
  }
}
