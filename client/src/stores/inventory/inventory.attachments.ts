import { IAttachment } from '../../interfaces';
import {
  ApplyInventoryPatches,
  RemoveInventoryItem,
  RemoveInventoryResource,
  SetInventory,
  UpdateInventoryItems,
} from './inventory.actions';
import {
  applyInventoryPatches,
  removeInventoryItem,
  removeInventoryResource,
  setInventory,
  updateInventoryItems,
} from './inventory.functions';

export const attachments: IAttachment[] = [
  { action: SetInventory, handler: setInventory },
  { action: ApplyInventoryPatches, handler: applyInventoryPatches },
  { action: UpdateInventoryItems, handler: updateInventoryItems },
  { action: RemoveInventoryItem, handler: removeInventoryItem },
  { action: RemoveInventoryResource, handler: removeInventoryResource },
];
