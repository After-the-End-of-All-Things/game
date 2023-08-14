import { Element, Stat } from './buildingblocks';

export interface ICombatMonsterAbility {
  ability: string;
}

export interface IMonsterRewardItem {
  item: string;
  chance: number;
}

export interface IMonsterReward {
  items: IMonsterRewardItem[];
  coins: number;
  xp: number;
}

export interface IMonster {
  itemId: string;
  location: string;
  job: string;
  level: number;
  sprite: number;
  statBoosts: Record<Stat, number>;
  resistances: Record<Element, number>;
  abilities: ICombatMonsterAbility[];
  rewards: IMonsterReward;
}
