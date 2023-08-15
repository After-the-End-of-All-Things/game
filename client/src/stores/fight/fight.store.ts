import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IFightStore } from '@interfaces';
import { defaultStore } from './fight.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './fight.attachments';

@State<IFightStore>({
  name: 'fight',
  defaults: defaultStore(),
})
@Injectable()
export class FightStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(FightStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static fight(state: IFightStore) {
    return state.fight;
  }
}
