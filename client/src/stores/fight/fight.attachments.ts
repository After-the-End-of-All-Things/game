import { applyFightPatches, setFight } from '@stores/fight/fight.functions';
import { IAttachment } from '../../interfaces';
import { ApplyFightPatches, SetFight } from './fight.actions';

export const attachments: IAttachment[] = [
  { action: SetFight, handler: setFight },
  { action: ApplyFightPatches, handler: applyFightPatches },
];
