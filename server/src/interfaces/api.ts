import * as jsonpatch from 'fast-json-patch';

import { Achievements } from '@modules/achievements/achievements.schema';
import { Crafting } from '@modules/crafting/crafting.schema';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Fight } from '@modules/fight/fight.schema';
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
  crafting: Crafting;
  items: InventoryItem[];
  fight: Fight;

  actions: Array<{ type: string } & any>;
}

export interface IPatchUser {
  user: jsonpatch.Operation[];
  player: jsonpatch.Operation[];
  stats: jsonpatch.Operation[];
  discoveries: jsonpatch.Operation[];
  achievements: jsonpatch.Operation[];
  inventory: jsonpatch.Operation[];
  items: jsonpatch.Operation[];
  crafting: jsonpatch.Operation[];
  fight: jsonpatch.Operation[];
}
