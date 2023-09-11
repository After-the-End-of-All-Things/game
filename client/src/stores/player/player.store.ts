import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { Currency, IPlayerStore } from '@interfaces';
import { defaultStore } from './player.functions';

import { getStateHelpers } from '@helpers/store-context';
import { attachments } from './player.attachments';

@State<IPlayerStore>({
  name: 'player',
  defaults: defaultStore(),
})
@Injectable()
export class PlayerStore {
  constructor() {
    const helpers = getStateHelpers();
    attachments.forEach(({ action, handler }) => {
      attachAction(PlayerStore, action, (ctx, action) => {
        handler(ctx, action, helpers);
      });
    });
  }

  @Selector()
  static player(state: IPlayerStore) {
    return state.player;
  }

  @Selector()
  static playerCoins(state: IPlayerStore) {
    return state.player.currencies[Currency.Coins];
  }

  @Selector()
  static playerOats(state: IPlayerStore) {
    return state.player.currencies[Currency.Oats];
  }

  @Selector()
  static playerLevel(state: IPlayerStore) {
    return state.player.level;
  }

  @Selector()
  static playerLocation(state: IPlayerStore) {
    return state.player.location;
  }

  @Selector()
  static playerAction(state: IPlayerStore) {
    return state.player.action;
  }

  @Selector()
  static playerShowcase(state: IPlayerStore) {
    return state.player.cosmetics.showcase || {};
  }

  @Selector()
  static exploreCooldown(state: IPlayerStore) {
    return state.player.location.cooldown;
  }
}
