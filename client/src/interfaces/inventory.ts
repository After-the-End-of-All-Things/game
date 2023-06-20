import { IInventory } from '@interfaces';

export interface IInventoryStore {
  version: number;
  inventory: IInventory;
}
