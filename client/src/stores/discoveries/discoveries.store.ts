import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IDiscoveriesStore } from '@interfaces';
import { defaultStore } from './discoveries.functions';

import { attachments } from './discoveries.attachments';

@State<IDiscoveriesStore>({
  name: 'discoveries',
  defaults: defaultStore(),
})
@Injectable()
export class DiscoveriesStore {
  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(DiscoveriesStore, action, handler);
    });
  }

  @Selector()
  static discoveries(state: IDiscoveriesStore) {
    return state.discoveries;
  }
}
