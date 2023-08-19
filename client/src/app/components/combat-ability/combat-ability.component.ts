import { Component, Input, OnInit } from '@angular/core';
import { ICombatAbility } from '@interfaces';

@Component({
  selector: 'app-combat-ability',
  templateUrl: './combat-ability.component.html',
  styleUrls: ['./combat-ability.component.scss'],
})
export class CombatAbilityComponent implements OnInit {
  @Input() ability!: ICombatAbility;

  public get imageName() {
    const pattern = this.ability.pattern.toLowerCase();
    const targetting =
      this.ability.targetting === 'Creature' ? 'center' : 'ground';

    return `${pattern}-${targetting}`;
  }

  constructor() {}

  ngOnInit() {}

  // TODO: ability damage
  abilityDamage() {
    return 0;
  }
}
