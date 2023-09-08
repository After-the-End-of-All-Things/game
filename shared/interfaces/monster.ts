import { Element, IWeighted, Stat } from './buildingblocks';

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
  name: string;
  job: string;
  level: number;
  sprite: number;
  statBoosts: Record<Stat, number>;
  resistances: Record<Element, number>;
  abilities: ICombatMonsterAbility[];
  rewards: IMonsterReward;
}

export interface IMonsterGroup {
  monster: string;
}

export interface IMonsterFormation extends IWeighted {
  name: string;
  itemId: string;
  weight: number;
  location: string;
  monsters: IMonsterGroup[];
}
