import { IAchievements } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetAchievements {
  static type = '[Achievements] Set';
  constructor(public achievements: IAchievements) {}
}

export class ApplyAchievementsPatches {
  static type = '[Achievements] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}
