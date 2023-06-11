import { IAttachment } from '../../interfaces';
import { ApplyStatsPatches, SetStats } from './stats.actions';
import { applyStatsPatches, setStats } from './stats.functions';

export const attachments: IAttachment[] = [
  { action: SetStats, handler: setStats },
  { action: ApplyStatsPatches, handler: applyStatsPatches },
];
