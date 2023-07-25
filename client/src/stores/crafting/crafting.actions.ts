import { ICrafting } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetCrafting {
  static type = '[Crafting] Set';
  constructor(public crafting: ICrafting) {}
}

export class ApplyCraftingPatches {
  static type = '[Crafting] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
