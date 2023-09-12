import { Stat } from './buildingblocks';
import { Armor, Weapon } from './item';

export interface IJob {
  name: string;
  short: string;
  description: string;
  statGainsPerLevel: Record<Stat, number>;
  armorSlots: Record<Armor, boolean>;
  weapons: Record<Weapon, number>;
}
