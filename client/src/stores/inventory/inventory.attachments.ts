import { IAttachment } from '../../interfaces';
import { ApplyInventoryPatches, SetInventory } from './inventory.actions';
import { applyInventoryPatches, setInventory } from './inventory.functions';

export const attachments: IAttachment[] = [
  { action: SetInventory, handler: setInventory },
  { action: ApplyInventoryPatches, handler: applyInventoryPatches },
];
