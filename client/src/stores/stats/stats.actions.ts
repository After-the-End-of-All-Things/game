import { IStats } from '@interfaces';

export class SetStats {
  static type = '[Stats] Set';
  constructor(public stats: IStats) {}
}
