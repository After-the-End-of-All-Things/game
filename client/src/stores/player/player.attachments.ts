import { IAttachment } from '../../interfaces';
import { ApplyPlayerPatches, SetPlayer } from './player.actions';
import { applyPlayerPatches, setPlayer } from './player.functions';

export const attachments: IAttachment[] = [
  { action: SetPlayer, handler: setPlayer },
  { action: ApplyPlayerPatches, handler: applyPlayerPatches },
];
