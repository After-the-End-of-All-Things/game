import { IAchievementsStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import {
  ApplyAchievementsPatches,
  SetAchievements,
} from './achievements.actions';

export const defaultStore: () => IAchievementsStore = () => ({
  version: 0,
  achievements: {
    achievements: {},
  },
});

export function setAchievements(
  ctx: StateContext<IAchievementsStore>,
  { achievements }: SetAchievements
) {
  ctx.patchState({ achievements });
}

export function applyAchievementsPatches(
  ctx: StateContext<IAchievementsStore>,
  { patches }: ApplyAchievementsPatches
) {
  const achievements = ctx.getState().achievements;

  applyPatch(achievements, patches);

  ctx.patchState({ achievements });
}
