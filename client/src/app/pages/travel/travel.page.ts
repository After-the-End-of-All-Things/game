import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ILocation, IPlayerLocation } from '@interfaces';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { DiscoveriesStore, PlayerStore } from '@stores';
import { sortBy } from 'lodash';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.page.html',
  styleUrls: ['./travel.page.scss'],
})
export class TravelPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @Select(PlayerStore.playerCoins) playerCoins$!: Observable<number>;
  @Select(PlayerStore.playerLocation)
  playerLocation$!: Observable<IPlayerLocation>;
  @Select(PlayerStore.playerLevel) playerLevel$!: Observable<number>;
  @Select(DiscoveriesStore.locations) locations$!: Observable<
    Record<string, ILocation>
  >;

  public currentLevel = 1;
  public currentCoins = 0;
  public currentLocation = '';
  public currentWalkTo = '';
  public locations: ILocation[] = [];

  constructor(
    private contentService: ContentService,
    private gameplayService: GameplayService
  ) {}

  ngOnInit() {
    combineLatest([this.playerCoins$, this.playerLocation$, this.playerLevel$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([coins, location, level]) => {
        this.currentCoins = coins;
        this.currentLocation = location.current;
        this.currentLevel = level;
        this.currentWalkTo = location.goingTo;
      });

    this.locations$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((locations) => {
        const locationData = Object.keys(locations)
          .map((loc) => this.contentService.getLocation(loc))
          .filter(Boolean);

        this.locations = sortBy(locationData, ['level', 'name']) as ILocation[];
      });
  }

  numLocationsDiscoveredAt(location: ILocation): number {
    return location.connections.filter((x) =>
      this.locations.find((y) => y.name === x.name)
    ).length;
  }

  walkToLocation(locationName: string) {
    this.gameplayService.walk(locationName).subscribe();
  }

  travelToLocation(locationName: string) {
    this.gameplayService.travel(locationName).subscribe();
  }
}
