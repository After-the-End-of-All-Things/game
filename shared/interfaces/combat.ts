import {
  EquipmentType,
  IEquipment,
  IMonsterReward,
  ItemSlot,
} from '@interfaces';
import { Element, Stat } from './buildingblocks';

export type ICombatAbilityTargetting =
  | 'Creature'
  | 'Ground'
  | 'Self'
  | 'AllCreatures';

export type ICombatAbilityPattern =
  | 'Single'
  | 'Cross'
  | 'CrossNoCenter'
  | 'ThreeVertical'
  | 'TwoHorizontal'
  | 'AllCreatures';

export interface ICombatTargetParams {
  tile?: {
    x: number;
    y: number;
  };

  characterIds?: string[];
}

export interface ICombatAbility {
  name: string;
  itemId: string;
  sprite: number;
  cooldown: number;
  targetting: ICombatAbilityTargetting;
  pattern: ICombatAbilityPattern;
  hits: number;
  targetInOrder: boolean;
  restrictToUserSide: boolean;
  requiresTileSelection: boolean;
  restrictTileSelectionToUserSide: boolean;
  description: string;
  requiredEquipment?: EquipmentType;
  requiredJob: string;
  requiredLevel: number;
  specialCost: number;
  specialAction?: string;
  elements: Element[];
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
  killRewards?: IMonsterReward;
}

export interface IFight {
  internalId: string;
  involvedPlayers: string[];
  turnOrder: string[];
  currentTurn: string;
  attackers: IFightCharacter[];
  defenders: IFightCharacter[];
  tiles: IFightTile[][];
  generatedElements: Partial<Record<Element, number>>;
  generatedCharge: number;
  statusMessage: IFightStatusMessage[];
}

export interface IFightStatusMessage {
  timestamp: number;
  context: string;
  message: string;
}

export interface IFightStore {
  version: number;
  fight: IFight;
}
