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

export interface IPlayer {
  xp: number;
  level: number;
  location: string;
  stats: Record<Stat, number>;
  recharges: Record<RechargeableStat, number>;

  currencies: Record<Currency, number>;

  profile: {
    shortBio: string;
    longBio: string;
  };

  cosmetics: {
    portrait: number;
    background: number;
  };
}
