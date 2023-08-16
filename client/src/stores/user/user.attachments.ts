import { IAttachment } from '@interfaces';
import { ApplyUserPatches, ChangePage, SetUser } from './user.actions';
import { applyUserPatches, changePage, setUser } from './user.functions';

export const attachments: IAttachment[] = [
  { action: SetUser, handler: setUser },
  { action: ApplyUserPatches, handler: applyUserPatches },
  { action: ChangePage, handler: changePage },
];
