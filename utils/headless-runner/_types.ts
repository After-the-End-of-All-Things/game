import { Wretch } from 'wretch/types';

export type PlayerApi = {
  name: string;
  api: Wretch;
  player: any;
  items: any[];
};
