import { ICraftingStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import {
  ApplyCraftingPatches,
  SetCrafting,
} from '@stores/crafting/crafting.actions';
import { applyPatch } from 'fast-json-patch';

export const defaultStore: () => ICraftingStore = () => ({
  version: 0,
  crafting: {
    armorerLevel: 1,
    armorerXp: 0,
    artisanLevel: 1,
    artisanXp: 0,
    smithLevel: 1,
    smithXp: 0,
    currentlyCrafting: '',
    currentlyCraftingDoneAt: 0,
  },
});

export function setCrafting(
  ctx: StateContext<ICraftingStore>,
  { crafting }: SetCrafting,
) {
  ctx.patchState({ crafting });
}

export function applyCraftingPatches(
  ctx: StateContext<ICraftingStore>,
  { patches }: ApplyCraftingPatches,
) {
  const crafting = ctx.getState().crafting;

  applyPatch(crafting, patches);

  ctx.patchState({ crafting });
}
