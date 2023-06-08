import { IAttachment } from '../../interfaces';
import { SetPlayer } from './player.actions';
import { setPlayer } from './player.functions';

export const attachments: IAttachment[] = [
  { action: SetPlayer, handler: setPlayer },
];
