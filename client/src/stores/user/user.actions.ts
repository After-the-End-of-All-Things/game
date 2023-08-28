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

export class ChangePage {
  static type = 'ChangePage';
  constructor(public newPage: string) {}
}

export class GrabData {
  static type = '[User] Grab Data';
  constructor(public data: any) {}
}
