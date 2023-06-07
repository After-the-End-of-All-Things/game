import { IAttachment } from '../../interfaces';
import { SetUser } from './user.actions';
import { setUser } from './user.functions';

export const attachments: IAttachment[] = [
  { action: SetUser, handler: setUser }
];
