import { Stat } from "./player";

export interface IJob {
  name: string;
  description: string;
  statGainsPerLevel: Record<Stat, number>;
}
