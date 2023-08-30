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
}

export interface IStats {
  stats: Partial<Record<TrackedStat, number>>;
}
