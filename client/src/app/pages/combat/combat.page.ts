import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Element,
  ICombatAbility,
  IFight,
  IFightCharacter,
  IMonster,
  IUser,
} from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { FightStore, UserStore } from '@stores';
import { ChangePage } from '@stores/user/user.actions';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @Select(UserStore.user) user$!: Observable<IUser>;
  @Select(FightStore.fight) fight$!: Observable<IFight>;

  public readonly elements: Element[] = [
    'fire',
    'water',
    'earth',
    'air',
    'light',
    'dark',
  ];

  public fight!: IFight;
  public fightCharacters: Record<string, IFightCharacter> = {};
  public myCharacterId = '';
  public selectedAbility: ICombatAbility | undefined;

  public get myCharacter(): IFightCharacter {
    return this.fightCharacters[this.myCharacterId];
  }

  constructor(private store: Store, private contentService: ContentService) {}

  ngOnInit() {
    combineLatest([this.user$, this.fight$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, fight]) => {
        if (!fight) {
          this.store.dispatch(new ChangePage('home'));
          return;
        }

        this.fight = fight;

        this.fightCharacters = {};
        [...fight.attackers, ...fight.defenders].forEach((character) => {
          this.fightCharacters[character.characterId] = character;

          if (character.userId === user.id) {
            this.myCharacterId = character.characterId;
          }
        });
      });
  }

  getMonster(id: string): IMonster {
    return this.contentService.getMonster(id) as IMonster;
  }

  getAbilities(): ICombatAbility[] {
    const allAbilities = [
      this.contentService.getAbilityByName('Unarmed Attack'),
      ...Object.values(this.myCharacter.equipment)
        .filter(Boolean)
        .map((item) => {
          return (item.abilities ?? [])
            .map((ability) => this.contentService.getAbility(ability))
            .flat();
        })
        .flat(),
    ];

    // TODO: job abilities

    return allAbilities.filter(Boolean) as ICombatAbility[];
  }

  selectAbility(ability: ICombatAbility) {
    this.selectedAbility = ability;
  }
}
