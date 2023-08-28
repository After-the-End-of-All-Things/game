import { Stat } from './buildingblocks';
import { INotificationAction } from './notifications';

export enum RechargeableStat {
  Health = 'health',
}

export enum Currency {
  Coins = 'coins',
  Oats = 'oats',
}

export interface IPlayerLocation {
  current: string;
  goingTo: string;
  arrivesAt: number;
  cooldown: number;
}

export interface IPlayerProfile {
  displayName: string;
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

  action?: INotificationAction;
}
