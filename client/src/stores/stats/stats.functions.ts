import { IStatsStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { SetStats } from './stats.actions';

export const defaultStore: () => IStatsStore = () => ({
  version: 0,
  stats: {
    stats: {},
  },
});

export function setStats(ctx: StateContext<IStatsStore>, { stats }: SetStats) {
  ctx.patchState({ stats });
}
