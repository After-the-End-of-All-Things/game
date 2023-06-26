import { Armor, Weapon } from '@interfaces';
import { Stat } from './player';

export interface IJob {
  name: string;
  description: string;
  statGainsPerLevel: Record<Stat, number>;
  armorSlots: Record<Armor, boolean>;
  weapons: Record<Weapon, number>;
}
