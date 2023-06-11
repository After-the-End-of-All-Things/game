import { IPlayer } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetPlayer {
  static type = '[Player] Set';
  constructor(public player: IPlayer) {}
}

export class ApplyPlayerPatches {
  static type = '[Player] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
