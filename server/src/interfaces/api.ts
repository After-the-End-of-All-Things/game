import { Achievements } from '@modules/achievements/achievements.schema';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Inventory } from '@modules/inventory/inventory.schema';
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
  discoveries: Discoveries;
  achievements: Achievements;
  inventory: Inventory;
}
