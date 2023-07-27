import { IAttachment } from '../../interfaces';
import {
  ApplyInventoryPatches,
  RemoveInventoryItem,
  SetInventory,
  UpdateInventoryItems,
} from './inventory.actions';
import {
  applyInventoryPatches,
  removeInventoryItem,
  setInventory,
  updateInventoryItems,
} from './inventory.functions';

export const attachments: IAttachment[] = [
  { action: SetInventory, handler: setInventory },
  { action: ApplyInventoryPatches, handler: applyInventoryPatches },
  { action: UpdateInventoryItems, handler: updateInventoryItems },
  { action: RemoveInventoryItem, handler: removeInventoryItem },
];
