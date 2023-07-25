import {
  ApplyCraftingPatches,
  SetCrafting,
} from '@stores/crafting/crafting.actions';
import {
  applyCraftingPatches,
  setCrafting,
} from '@stores/crafting/crafting.functions';
import { IAttachment } from '../../interfaces';

export const attachments: IAttachment[] = [
  { action: SetCrafting, handler: setCrafting },
  { action: ApplyCraftingPatches, handler: applyCraftingPatches },
];
