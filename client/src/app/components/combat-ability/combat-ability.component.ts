import { Component, Input, OnInit } from '@angular/core';
import { ICombatAbility, Stat } from '@interfaces';

@Component({
  selector: 'app-combat-ability',
  templateUrl: './combat-ability.component.html',
  styleUrls: ['./combat-ability.component.scss'],
})
export class CombatAbilityComponent implements OnInit {
  @Input() ability!: ICombatAbility;
  @Input() stats!: Record<Stat, number>;
  @Input() cooldownRemaining = 0;

  public get imageName() {
    const pattern = this.ability.pattern.toLowerCase();
    const targetting =
      this.ability.targetting === 'Creature' ? 'center' : 'ground';

    return `${pattern}-${targetting}`;
  }

  constructor() {}

  ngOnInit() {}

  abilityDamage(): number {
    return +Object.keys(this.ability.statScaling)
      .map(
        (stat) =>
          (this.ability.statScaling?.[stat as Stat] ?? 0) *
          this.stats[stat as Stat],
      )
      .reduce((a, b) => a + b, 0)
      .toFixed(1);
  }
}
