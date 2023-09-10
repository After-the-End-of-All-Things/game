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

export type LocationNPCType = 'ClassTrainer';

export interface ILocationConnection {
  name: string;
}

export interface ILocation {
  name: string;
  description: string;
  background: string;
  level: number;
  itemLevel: number;
  steps: number;
  cost: number;
  baseStats: Record<LocationStat, number>;
  connections: ILocationConnection[];
  npcs: Array<{ name: string }>;
}

export interface ILocationNPC {
  name: string;
  itemId: string;
  sprite: number;
  type: LocationNPCType;
  properties: Record<string, any>;
}
