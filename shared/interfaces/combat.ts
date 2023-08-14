import { Element, Stat } from './buildingblocks';

export type ICombatAbilityTargetting = 'Creature' | 'Ground';

export type ICombatAbilityPattern =
  | 'Single'
  | 'Cross'
  | 'ThreeVertical'
  | 'TwoHorizontal';

export interface ICombatAbility {
  name: string;
  itemId: string;
  sprite: number;
  targetting: ICombatAbilityTargetting;
  pattern: ICombatAbilityPattern;
  elements: Element[];
  statScaling: Partial<Record<Stat, number>>;
}
