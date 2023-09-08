import { IWeighted } from '@interfaces';
import { sample } from 'lodash';

export function pickWeighted<T>(weights: IWeighted[]): T {
  return sample(weights.map((w) => new Array(w.weight).fill(w)).flat()) as T;
}
