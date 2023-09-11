import { IDiscoveries } from '@interfaces';

export enum TrackedStat {
  WavesTo = 'wavesTo',
  WavesFrom = 'wavesFrom',
  TimesExplored = 'timesExplored',
  TimesTraveled = 'timesTraveled',
  ItemsFound = 'itemsFound',
  ItemsSold = 'itemsSold',
  ItemsCrafted = 'itemsCrafted',
  CombatActionsTaken = 'combatActionsTaken',
  CombatAttacksGiven = 'combatAttacksGiven',
  CombatAttacksReceived = 'combatAttacksReceived',
  CombatTurnsTaken = 'combatTurnsTaken',
  CombatKills = 'combatKills',
  CombatDeaths = 'combatDeaths',
  CombatWins = 'combatWins',
  CombatLosses = 'combatLosses',
  CombatFlees = 'combatFlees',
  ClassChanges = 'classChanges',
}

export interface IStats {
  stats: Partial<Record<TrackedStat, number>>;

  location: string;
  name: string;
  discriminator: string;
  portrait: number;
  level: number;
  discoveries: Partial<Record<keyof IDiscoveries, number>>;
}
