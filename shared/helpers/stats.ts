import { Element, Stat } from '../interfaces';

export function zeroStats(): Record<Stat, number> {
  return {
    [Stat.Health]: 0,
    [Stat.Power]: 0,
    [Stat.Magic]: 0,
    [Stat.Toughness]: 0,
    [Stat.Resistance]: 0,
    [Stat.Special]: 0,
  };
}

export function zeroResistances(): Record<Element, number> {
  return {
    air: 1,
    dark: 1,
    earth: 1,
    fire: 1,
    light: 1,
    neutral: 1,
    water: 1,
  };
}
