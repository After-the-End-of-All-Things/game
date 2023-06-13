import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IStatsStore } from '@interfaces';
import { defaultStore } from './stats.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './stats.attachments';

@State<IStatsStore>({
  name: 'stats',
  defaults: defaultStore(),
})
@Injectable()
export class StatsStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(StatsStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static stats(state: IStatsStore) {
    return state.stats;
  }
}
