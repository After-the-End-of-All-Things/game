import { Component, Input, OnInit } from '@angular/core';
import { Element, ICombatAbility, Stat } from '@interfaces';
import { sum } from 'lodash';

@Component({
  selector: 'app-combat-ability',
  templateUrl: './combat-ability.component.html',
  styleUrls: ['./combat-ability.component.scss'],
})
export class CombatAbilityComponent implements OnInit {
  @Input() ability!: ICombatAbility;
  @Input() stats!: Record<Stat, number>;
  @Input() cooldownRemaining = 0;
  @Input() disabled = false;
  @Input() elements: Partial<Record<Element, number>> = {};

  public get imageName() {
    const pattern = this.ability.pattern.toLowerCase();
    const targetting =
      this.ability.targetting === 'Creature' ? 'center' : 'ground';

    return `${pattern}-${targetting}`;
  }

  public get isPhysical(): boolean {
    return (
      (this.ability.statScaling?.power ?? 0) > 0 ||
      (this.ability.statScaling?.toughness ?? 0) > 0
    );
  }

  public get isMagical(): boolean {
    return (
      (this.ability.statScaling?.magic ?? 0) > 0 ||
      (this.ability.statScaling?.resistance ?? 0) > 0
    );
  }

  public get specialCost(): number {
    return this.ability.specialCost ?? 0;
  }

  constructor() {}

  ngOnInit() {}

  elementMultiplier(): number {
    return (
      1 + sum(this.ability.elements.map((el) => this.elements[el] ?? 0)) * 0.05
    );
  }

  abilityDamage(): number {
    if (!this.stats) return 0;

    return +Object.keys(this.ability.statScaling)
      .map(
        (stat) =>
          (this.ability.statScaling?.[stat as Stat] ?? 0) *
          this.stats[stat as Stat],
      )
      .reduce((a, b) => a + b * Math.max(this.ability.hits, 1), 0)
      .toFixed(1);
  }

  totalDamage(): number {
    return this.abilityDamage() * this.elementMultiplier();
  }
}
