export enum TrackedStat {
  WavesTo = "wavesTo",
  WavesFrom = "wavesFrom",
  TimesExplored = "timesExplored",
}

export interface IStats {
  stats: Partial<Record<TrackedStat, number>>;
}
