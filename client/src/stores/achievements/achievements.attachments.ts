import { IAttachment } from '../../interfaces';
import {
  ApplyAchievementsPatches,
  SetAchievements,
} from './achievements.actions';
import {
  applyAchievementsPatches,
  setAchievements,
} from './achievements.functions';

export const attachments: IAttachment[] = [
  { action: SetAchievements, handler: setAchievements },
  { action: ApplyAchievementsPatches, handler: applyAchievementsPatches },
];
