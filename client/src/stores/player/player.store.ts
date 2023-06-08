import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';

import { IPlayerStore } from '../../interfaces';
import { defaultStore } from './player.functions';

import { attachments } from './player.attachments';

@State<IPlayerStore>({
  name: 'user',
  defaults: defaultStore(),
})
@Injectable()
export class PlayerStore {
  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(PlayerStore, action, handler);
    });
  }

  @Selector()
  static player(state: IPlayerStore) {
    return state.player;
  }
}
