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
  targetting: ICombatAbilityTargetting;
  pattern: ICombatAbilityPattern;
  targetInOrder: boolean;
  restrictToUserSide: boolean;
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
  x: number;
  y: number;
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
  totalStats: Record<Stat, number>;
  baseResistances: Record<Element, number>;
  totalResistances: Record<Element, number>;
  cooldowns: Record<string, number>;
  equipment: Partial<Record<ItemSlot, IEquipment>>;
}

export interface IFight {
  id: string;
  involvedPlayers: string[];
  turnOrder: string[];
  currentTurn: string;
  attackers: IFightCharacter[];
  defenders: IFightCharacter[];
  tiles: IFightTile[][];
  generatedElements: Partial<Record<Element, number>>;
  statusMessage: string;
}

export interface IFightStore {
  version: number;
  fight: IFight;
}
