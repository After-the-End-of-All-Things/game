export enum LocationStat {
  XPGain = "xpGain",
  CoinGain = "coinGain",
  ExploreSpeed = "exploreSpeed",
  LocationFind = "locationFind",
  ItemFind = "itemFind",
  NPCEncounter = "npcEncounter",
  CollectibleFind = "collectibleFind",
}

export interface ILocationConnection {
  name: string;
}

export interface ILocation {
  name: string;
  description: string;
  background: string;
  level: number;
  steps: number;
  cost: number;
  baseStats: Record<LocationStat, number>;
  connections: ILocationConnection[];
}
