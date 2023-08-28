import {
  applyFightPatches,
  clearFight,
  setFight,
} from '@stores/fight/fight.functions';
import { IAttachment } from '../../interfaces';
import { ApplyFightPatches, ClearFight, SetFight } from './fight.actions';

export const attachments: IAttachment[] = [
  { action: SetFight, handler: setFight },
  { action: ClearFight, handler: clearFight },
  { action: ApplyFightPatches, handler: applyFightPatches },
];
