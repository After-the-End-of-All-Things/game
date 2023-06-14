import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IAchievementsStore } from '@interfaces';
import { defaultStore } from './achievements.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './achievements.attachments';

@State<IAchievementsStore>({
  name: 'achievements',
  defaults: defaultStore(),
})
@Injectable()
export class AchievementsStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(AchievementsStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static achievements(state: IAchievementsStore) {
    return state.achievements;
  }
}
