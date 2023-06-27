import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IInventoryStore } from '@interfaces';
import { defaultStore } from './inventory.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './inventory.attachments';

@State<IInventoryStore>({
  name: 'inventory',
  defaults: defaultStore(),
})
@Injectable()
export class InventoryStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(InventoryStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static inventory(state: IInventoryStore) {
    return state.inventory;
  }

  @Selector()
  static equipped(state: IInventoryStore) {
    return state.inventory.equippedItems;
  }
}
