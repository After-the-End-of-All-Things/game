import { Player } from '@modules/player/player.schema';
import { Stats } from '@modules/stats/stats.schema';
import { User } from '@modules/user/user.schema';

export interface IHasAccessToken {
  access_token: string;
}

export interface IFullUser {
  user: User;
  player: Player;
  stats: Stats;
}
