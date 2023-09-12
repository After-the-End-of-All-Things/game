import { IStatsStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import { ApplyStatsPatches, SetStats } from './stats.actions';

export const defaultStore: () => IStatsStore = () => ({
  version: 0,
  stats: {
    stats: {},
    discoveries: {},
    location: '',
    name: '',
    discriminator: '',
    portrait: -1,
    level: 1,
    job: '',
  },
});

export function setStats(ctx: StateContext<IStatsStore>, { stats }: SetStats) {
  ctx.patchState({ stats });
}

export function applyStatsPatches(
  ctx: StateContext<IStatsStore>,
  { patches }: ApplyStatsPatches,
) {
  const stats = ctx.getState().stats;

  applyPatch(stats, patches);

  ctx.patchState({ stats });
}
