import { Stat } from './buildingblocks';
import { INotificationAction } from './notifications';

export enum RechargeableStat {
  Health = 'health',
}

export enum Currency {
  Coins = 'coins',
  Oats = 'oats',
}

export enum OOCBuff {
  TravelSpeed = 'travel',
  XP = 'xp',
  Coins = 'coins',
  Offense = 'offense',
  Defense = 'defense',
  Nothing = 'nothing',
}

export interface IPlayerLocation {
  current: string;
  goingTo: string;
  arrivesAt: number;
  cooldownStart: number;
  cooldown: number;
}

export interface IPlayerProfile {
  displayName: string;
  discriminator: string;
  shortBio: string;
  longBio: string;
}

export interface IPlayerShowcase {
  collectibles: string[];
  items: string[];
}

export interface IPlayerCosmetics {
  portrait: number;
  background: number;
  showcase: IPlayerShowcase;
}

export interface IPlayer {
  userId: string;

  xp: number;
  level: number;
  stats: Record<Stat, number>;
  recharges: Record<RechargeableStat, number>;
  job: string;

  otherJobLevels: Record<string, number>;
  otherJobXp: Record<string, number>;

  currencies: Record<Currency, number>;

  location: IPlayerLocation;

  profile: IPlayerProfile;

  cosmetics: IPlayerCosmetics;

  action?: INotificationAction;

  deityPrayerCooldown: number;
  deityBuffs: Record<OOCBuff, number>;
}
