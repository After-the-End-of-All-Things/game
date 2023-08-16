import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IFight } from '@interfaces';
import { Select, Store } from '@ngxs/store';
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

  public fight!: IFight;

  constructor(private store: Store) {}

  ngOnInit() {
    this.fight$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fight) => {
      if (!fight) {
        this.store.dispatch(new ChangePage('home'));
        return;
      }

      this.fight = fight;
    });
  }
}
