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
    involvedPlayers: [],
    tiles: [],
  },
});

export function setFight(ctx: StateContext<IFightStore>, { fight }: SetFight) {
  ctx.patchState({ fight });
}

export function applyFightPatches(
  ctx: StateContext<IFightStore>,
  { patches }: ApplyFightPatches,
) {
  const fight = ctx.getState().fight;

  applyPatch(fight, patches);

  ctx.patchState({ fight });
}
