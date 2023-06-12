import { IAchievements } from '@interfaces';

export interface IAchievementsStore {
  version: number;
  achievements: IAchievements;
}
