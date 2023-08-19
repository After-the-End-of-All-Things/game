import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Element, IFight, IFightCharacter, IMonster } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { FightStore } from '@stores';
import { ChangePage } from '@stores/user/user.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {
  private destroyRef = inject(DestroyRef);

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

  constructor(private store: Store, private contentService: ContentService) {}

  ngOnInit() {
    this.fight$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fight) => {
      if (!fight) {
        this.store.dispatch(new ChangePage('home'));
        return;
      }

      this.fight = fight;

      this.fightCharacters = {};
      [...fight.attackers, ...fight.defenders].forEach((character) => {
        this.fightCharacters[character.characterId] = character;
      });
    });
  }

  getMonster(id: string): IMonster {
    return this.contentService.getMonster(id) as IMonster;
  }
}
