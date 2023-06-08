import { IAttachment } from '../../interfaces';
import { SetStats } from './stats.actions';
import { setStats } from './stats.functions';

export const attachments: IAttachment[] = [
  { action: SetStats, handler: setStats },
];
