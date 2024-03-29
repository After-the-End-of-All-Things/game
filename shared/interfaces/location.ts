export enum LocationStat {
  XPGain = 'xpGain',
  CoinGain = 'coinGain',
  ExploreSpeed = 'exploreSpeed',
  LocationFind = 'locationFind',
  ItemFind = 'itemFind',
  NPCEncounter = 'npcEncounter',
  Wave = 'wave',
  CollectibleFind = 'collectibleFind',
  ResourceFind = 'resourceFind',
  MonsterFind = 'monsterFind',
  TaxRate = 'taxRate',
}

export type ClassTrainerProperties = { text: string; changeJob: string };
export type SpriteUnlockerProperties = {
  text: string;
  unlockSprite: number;
  unlockCost: number;
};
export type BackgroundUnlockerProperties = {
  text: string;
  unlockBackground: string;
  unlockCost: number;
};

export type LocationNPCProperties =
  | ClassTrainerProperties
  | SpriteUnlockerProperties
  | BackgroundUnlockerProperties;

export type LocationNPCType =
  | 'ClassTrainer'
  | 'SpriteUnlocker'
  | 'BackgroundUnlocker';

export interface ILocationConnection {
  name: string;
}

export interface ILocationLimitedAccess {
  activeMonth: number;
}

export interface ILocation {
  name: string;
  description: string;
  background: number;
  level: number;
  itemLevel: number;
  steps: number;
  cost: number;
  baseStats: Record<LocationStat, number>;
  connections: ILocationConnection[];
  npcs: Array<{ name: string }>;
  limited?: ILocationLimitedAccess;
}

export interface ILocationNPC {
  name: string;
  itemId: string;
  sprite: number;
  type: LocationNPCType;
  properties: Record<string, keyof LocationNPCProperties>;
}
