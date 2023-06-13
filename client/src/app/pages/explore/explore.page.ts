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
      });
  }

  explore() {
    this.gameplayService.explore().subscribe();
  }
}
