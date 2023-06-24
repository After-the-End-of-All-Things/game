import * as jsonpatch from 'fast-json-patch';

import { Achievements } from '@modules/achievements/achievements.schema';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryItem } from '@modules/inventory/inventoryitem.schema';
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
  items: InventoryItem[];
}

export interface IPatchUser {
  user: jsonpatch.Operation[];
  player: jsonpatch.Operation[];
  stats: jsonpatch.Operation[];
  discoveries: jsonpatch.Operation[];
  achievements: jsonpatch.Operation[];
  inventory: jsonpatch.Operation[];
  items: jsonpatch.Operation[];
}
