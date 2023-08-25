import { IEquipment, ItemSlot } from '@interfaces';
import { Element, Stat } from './buildingblocks';

export type ICombatAbilityTargetting = 'Creature' | 'Ground' | 'Self';

export type ICombatAbilityPattern =
  | 'Single'
  | 'Cross'
  | 'CrossNoCenter'
  | 'ThreeVertical'
  | 'TwoHorizontal';

export interface ICombatTargetParams {
  tile?: {
    x: number;
    y: number;
  };

  targetId?: string;
}

export interface ICombatAbility {
  name: string;
  itemId: string;
  sprite: number;
  cooldown: number;
  castTime: number;
  targetting: ICombatAbilityTargetting;
  pattern: ICombatAbilityPattern;
  description: string;
  requiredJob: string;
  requiredLevel: number;
  elements: Element[];
  specialAction?: string;
  generatedElements: Element[];
  statScaling: Partial<Record<Stat, number>>;
}

export interface IFightTile {
  containedCharacters: string[];
}

export interface IFightCharacter {
  userId?: string;
  monsterId?: string;
  characterId: string;
  sprite: number;
  name: string;
  level: number;
  job: string;
  health: { current: number; max: number };
  baseStats: Record<Stat, number>;
  modifiedStats: Record<Stat, number>;
  resistances: Record<Element, number>;
  cooldowns: Record<string, number>;
  equipment: Partial<Record<ItemSlot, IEquipment>>;
}

export interface IFight {
  id: string;
  involvedPlayers: string[];
  turnOrder: string[];
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
