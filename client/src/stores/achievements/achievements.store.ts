import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IAchievementsStore } from '@interfaces';
import { defaultStore } from './achievements.functions';

import { attachments } from './achievements.attachments';

@State<IAchievementsStore>({
  name: 'achievements',
  defaults: defaultStore(),
})
@Injectable()
export class AchievementsStore {
  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(AchievementsStore, action, handler);
    });
  }

  @Selector()
  static achievements(state: IAchievementsStore) {
    return state.achievements;
  }
}
