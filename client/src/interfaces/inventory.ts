import { IInventory, IItem } from '@interfaces';

export interface IInventoryStore {
  version: number;
  inventory: IInventory;
  items: IItem[];
  isLoadingItems: boolean;
}
