import { IInventory } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetInventory {
  static type = '[Inventory] Set';
  constructor(public inventory: IInventory) {}
}

export class ApplyInventoryPatches {
  static type = '[Inventory] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}

export class RemoveItemFromInventory {
  static type = '[Inventory] Remove Item';
  constructor(public instanceId: string) {}
}

export class UpdateInventoryItems {
  static type = 'UpdateInventoryItems';
  constructor() {}
}

export class RemoveInventoryItem {
  static type = 'RemoveInventoryItem';
  constructor(public instanceId: string) {}
}

export class RemoveInventoryResource {
  static type = 'RemoveInventoryResource';
  constructor(public itemId: string, public quantity: number) {}
}
