import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IMarketStore } from '@interfaces';
import { defaultStore } from './market.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './market.attachments';

@State<IMarketStore>({
  name: 'market',
  defaults: defaultStore(),
})
@Injectable()
export class MarketStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(MarketStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static marketData(state: IMarketStore) {
    return state.marketData;
  }
}
