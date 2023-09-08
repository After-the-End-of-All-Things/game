export type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Unusual'
  | 'Rare'
  | 'Masterful'
  | 'Arcane'
  | 'Epic'
  | 'Divine'
  | 'Unique';

export type Element =
  | 'neutral'
  | 'fire'
  | 'water'
  | 'earth'
  | 'air'
  | 'light'
  | 'dark';

export enum Stat {
  Health = 'health',
  Power = 'power',
  Toughness = 'toughness',
  Magic = 'magic',
  Resistance = 'resistance',
  Special = 'special',
}

export interface IWeighted {
  weight: number;
  itemId: string;
}
