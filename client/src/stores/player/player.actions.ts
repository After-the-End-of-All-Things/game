import { IPlayer } from '@interfaces';

export class SetPlayer {
  static type = '[Player] Set';
  constructor(public player: IPlayer) {}
}
