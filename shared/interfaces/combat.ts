import { IEquipment, ItemSlot } from '@interfaces';
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
  cooldown: number;
  targetting: ICombatAbilityTargetting;
  pattern: ICombatAbilityPattern;
  description: string;
  requiredJob: string;
  requiredLevel: number;
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
  name: string;
  level: number;
  job: string;
  baseStats: Record<Stat, number>;
  modifiedStats: Record<Stat, number>;
  resistances: Record<Element, number>;
  cooldowns: Record<string, number>;
  equipment: Partial<Record<ItemSlot, IEquipment>>;
}

export interface IFight {
  id: string;
  involvedPlayers: string[];
  attackers: IFightCharacter[];
  defenders: IFightCharacter[];
  tiles: IFightTile[][];
  currentTurn: string;
  generatedElements: Partial<Record<Element, number>>;
}

export interface IFightStore {
  version: number;
  fight: IFight;
}
