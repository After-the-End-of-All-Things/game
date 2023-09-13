import { IWeighted } from '@interfaces';
import { sample } from 'lodash';

export function pickWeighted<T>(weights: IWeighted[]): T | undefined {
  if (weights.length === 0) return undefined;
  if (weights.length === 1) return weights[0] as T;

  return sample(weights.map((w) => new Array(w.weight).fill(w)).flat()) as T;
}
