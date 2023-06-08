import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IStatsStore } from '@interfaces';
import { defaultStore } from './stats.functions';

import { attachments } from './stats.attachments';

@State<IStatsStore>({
  name: 'stats',
  defaults: defaultStore(),
})
@Injectable()
export class StatsStore {
  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(StatsStore, action, handler);
    });
  }

  @Selector()
  static stats(state: IStatsStore) {
    return state.stats;
  }
}
