export enum Stat {
  Health = "health",
  Power = "power",
  Toughness = "toughness",
  Magic = "magic",
  Resistance = "resistance",
  Special = "special",
}

export enum RechargeableStat {
  Health = "health",
}

export enum Currency {
  Coins = "coins",
}

export interface IPlayerLocation {
  current: string;
  goingTo: string;
  arrivesAt: number;
  cooldown: number;
}

export interface IPlayerProfile {
  shortBio: string;
  longBio: string;
}

export interface IPlayerCosmetics {
  portrait: number;
  background: number;
}

export interface IPlayer {
  xp: number;
  level: number;
  stats: Record<Stat, number>;
  recharges: Record<RechargeableStat, number>;
  job: string;

  currencies: Record<Currency, number>;

  location: IPlayerLocation;

  profile: IPlayerProfile;

  cosmetics: IPlayerCosmetics;
}
