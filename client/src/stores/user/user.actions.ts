import { IUser } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetUser {
  static type = '[User] Set';
  constructor(public user: IUser) {}
}

export class ApplyUserPatches {
  static type = '[User] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
