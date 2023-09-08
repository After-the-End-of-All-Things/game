import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IFight, INotificationAction, IPlayerLocation } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { ActionsService } from '@services/actions.service';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { VisualService } from '@services/visual.service';
import { FightStore, PlayerStore } from '@stores';
import { ChangePage } from '@stores/user/user.actions';
import { Observable, combineLatest, timer } from 'rxjs';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  public canExplore = false;
  public firstPositiveNumber = 0;
  public nextExploreTime = 0;

  @Select(PlayerStore.exploreCooldown) exploreCooldown$!: Observable<number>;
  @Select(PlayerStore.playerLocation)
  playerLocation$!: Observable<IPlayerLocation>;
  @Select(PlayerStore.playerAction)
  playerAction$!: Observable<INotificationAction>;
  @Select(FightStore.fight) fight$!: Observable<IFight>;

  constructor(
    private store: Store,
    private gameplayService: GameplayService,
    private contentService: ContentService,
    public actionsService: ActionsService,
    public visualService: VisualService,
  ) {}

  ngOnInit() {
    this.fight$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fight) => {
      if (!fight) return;

      this.store.dispatch(new ChangePage('combat'));
    });

    combineLatest([timer(0, 500), this.exploreCooldown$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([_, cooldown]) => {
        this.canExplore = Date.now() > cooldown;

        if (!this.canExplore) {
          if (!this.firstPositiveNumber) {
            this.firstPositiveNumber = (cooldown - Date.now()) / 1000;
          }

          this.nextExploreTime =
            1 - (cooldown - Date.now()) / 1000 / this.firstPositiveNumber;
        }

        if (this.canExplore) {
          this.firstPositiveNumber = 0;
        }
      });
  }

  explore() {
    this.canExplore = false;
    this.gameplayService.explore().subscribe();
  }

  getMonster(monsterId: string) {
    return this.contentService.getMonster(monsterId)!;
  }
}
