import { IFightStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import { ApplyFightPatches, SetFight } from './fight.actions';

export const defaultStore: () => IFightStore = () => ({
  version: 0,
  fight: {
    id: '',
    attackers: [],
    defenders: [],
    turnOrder: [],
    involvedPlayers: [],
    tiles: [],
    currentTurn: '',
    generatedElements: {},
  },
});

export function setFight(ctx: StateContext<IFightStore>, { fight }: SetFight) {
  ctx.patchState({ fight });
}

export function clearFight(ctx: StateContext<IFightStore>) {
  ctx.patchState({ fight: defaultStore().fight });
}

export function applyFightPatches(
  ctx: StateContext<IFightStore>,
  { patches }: ApplyFightPatches,
) {
  const fight = ctx.getState().fight;

  applyPatch(fight, patches);

  ctx.patchState({ fight });
}
