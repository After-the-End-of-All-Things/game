import { Element, Stat } from './buildingblocks';

export type ICombatAbilityTargetting = 'Creature' | 'Ground';

export type ICombatAbilityPattern =
  | 'Single'
  | 'Cross'
  | 'ThreeVertical'
  | 'TwoHorizontal';

export interface ICombatAbility {
  name: string;
  itemId: string;
  sprite: number;
  targetting: ICombatAbilityTargetting;
  pattern: ICombatAbilityPattern;
  elements: Element[];
  statScaling: Partial<Record<Stat, number>>;
}

export interface IFightTile {
  containedCharacters: string[];
}

export interface IFightCharacter {
  userId?: string;
  monsterId?: string;
  characterId: string;
  modifiedStats: Record<Stat, number>;
}

export interface IFight {
  id: string;
  involvedPlayers: string[];
  attackers: IFightCharacter[];
  defenders: IFightCharacter[];
  tiles: IFightTile[][];
}

export interface IFightStore {
  version: number;
  fight: IFight;
}
