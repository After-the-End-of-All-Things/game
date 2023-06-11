import { IAttachment } from '@interfaces';
import { ApplyUserPatches, SetUser } from './user.actions';
import { applyUserPatches, setUser } from './user.functions';

export const attachments: IAttachment[] = [
  { action: SetUser, handler: setUser },
  { action: ApplyUserPatches, handler: applyUserPatches },
];
