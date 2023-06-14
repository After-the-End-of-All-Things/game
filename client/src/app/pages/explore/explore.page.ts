import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { VisualService } from '@services/visual.service';
import { PlayerStore } from '@stores';
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

  constructor(
    private gameplayService: GameplayService,
    public visualService: VisualService
  ) {}

  ngOnInit() {
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
    this.gameplayService.explore().subscribe();
  }
}
