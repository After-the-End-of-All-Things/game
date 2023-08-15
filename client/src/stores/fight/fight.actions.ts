import { IFight } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetFight {
  static type = '[Fight] Set';
  constructor(public fight: IFight) {}
}

export class ApplyFightPatches {
  static type = '[Fight] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
