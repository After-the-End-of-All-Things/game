import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IOptionsStore } from '@interfaces';
import { defaultStore } from './options.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './options.attachments';

@State<IOptionsStore>({
  name: 'options',
  defaults: defaultStore(),
})
@Injectable()
export class OptionsStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(OptionsStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static options(state: IOptionsStore) {
    return state.options;
  }

  @Selector()
  static quality(state: IOptionsStore) {
    return state.options.assetQuality;
  }
}
