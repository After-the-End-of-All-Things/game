import { IDiscoveriesStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import { ApplyDiscoveriesPatches, SetDiscoveries } from './discoveries.actions';

export const defaultStore: () => IDiscoveriesStore = () => ({
  version: 0,
  discoveries: {
    backgrounds: {},
    locations: {},
    portraits: {},
  },
});

export function setDiscoveries(
  ctx: StateContext<IDiscoveriesStore>,
  { discoveries }: SetDiscoveries
) {
  ctx.patchState({ discoveries });
}

export function applyDiscoveriesPatches(
  ctx: StateContext<IDiscoveriesStore>,
  { patches }: ApplyDiscoveriesPatches
) {
  const discoveries = ctx.getState().discoveries;

  applyPatch(discoveries, patches);

  ctx.patchState({ discoveries });
}
