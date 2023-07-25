import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { ICraftingStore } from '@interfaces';
import { defaultStore } from './crafting.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './crafting.attachments';

@State<ICraftingStore>({
  name: 'crafting',
  defaults: defaultStore(),
})
@Injectable()
export class CraftingStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(CraftingStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static armorer(state: ICraftingStore) {
    return { level: state.crafting.armorerLevel, xp: state.crafting.armorerXp };
  }

  @Selector()
  static artisan(state: ICraftingStore) {
    return { level: state.crafting.artisanLevel, xp: state.crafting.artisanXp };
  }

  @Selector()
  static smith(state: ICraftingStore) {
    return { level: state.crafting.smithLevel, xp: state.crafting.smithXp };
  }

  @Selector()
  static currentlyCrafting(state: ICraftingStore) {
    return {
      endsAt: state.crafting.currentlyCraftingDoneAt,
      item: state.crafting.currentlyCrafting,
    };
  }
}
