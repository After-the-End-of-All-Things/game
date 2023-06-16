import { GameOption } from '@interfaces';

export class SetOption {
  static type = '[Option] Set';
  constructor(public option: GameOption, public value: number | string) {}
}
