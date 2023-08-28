import { IAttachment } from '@interfaces';
import {
  ApplyUserPatches,
  ChangePage,
  GrabData,
  SetUser,
} from './user.actions';
import {
  applyUserPatches,
  changePage,
  grabData,
  setUser,
} from './user.functions';

export const attachments: IAttachment[] = [
  { action: SetUser, handler: setUser },
  { action: ApplyUserPatches, handler: applyUserPatches },
  { action: ChangePage, handler: changePage },
  { action: GrabData, handler: grabData },
];
