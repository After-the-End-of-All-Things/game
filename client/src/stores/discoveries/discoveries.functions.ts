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
    borders: {},
    collectibles: {},
    items: {},
    monsters: {},
    uniqueCollectibleClaims: 0,
    totalCollectibleClaims: 0,
    uniqueEquipmentClaims: 0,
    totalEquipmentClaims: 0,
    uniqueMonsterClaims: 0,
    totalMonsterClaims: 0,
  },
});

export function setDiscoveries(
  ctx: StateContext<IDiscoveriesStore>,
  { discoveries }: SetDiscoveries,
) {
  ctx.patchState({ discoveries });
}

export function applyDiscoveriesPatches(
  ctx: StateContext<IDiscoveriesStore>,
  { patches }: ApplyDiscoveriesPatches,
) {
  const discoveries = ctx.getState().discoveries;

  applyPatch(discoveries, patches);

  ctx.patchState({ discoveries });
}
