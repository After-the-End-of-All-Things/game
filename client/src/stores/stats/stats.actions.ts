import { IStats } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetStats {
  static type = '[Stats] Set';
  constructor(public stats: IStats) {}
}

export class ApplyStatsPatches {
  static type = '[Stats] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
