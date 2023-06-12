import { IDiscoveries } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetDiscoveries {
  static type = '[Discoveries] Set';
  constructor(public discoveries: IDiscoveries) {}
}

export class ApplyDiscoveriesPatches {
  static type = '[Discoveries] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
