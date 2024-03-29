import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IDiscoveriesStore } from '@interfaces';
import { defaultStore } from './discoveries.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './discoveries.attachments';

@State<IDiscoveriesStore>({
  name: 'discoveries',
  defaults: defaultStore(),
})
@Injectable()
export class DiscoveriesStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(DiscoveriesStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static discoveries(state: IDiscoveriesStore) {
    return state.discoveries;
  }

  @Selector()
  static collectibles(state: IDiscoveriesStore) {
    return state.discoveries.collectibles;
  }

  @Selector()
  static locations(state: IDiscoveriesStore) {
    return state.discoveries.locations;
  }
}
