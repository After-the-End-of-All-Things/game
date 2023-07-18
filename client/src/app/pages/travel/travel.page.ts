import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ILocation, IPlayerLocation } from '@interfaces';
import { AlertController } from '@ionic/angular';
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

  @Select(DiscoveriesStore.collectibles) collectibles$!: Observable<
    Record<string, boolean>
  >;
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
  public collectibles: Record<string, boolean> = {};

  constructor(
    private contentService: ContentService,
    private gameplayService: GameplayService,
    private alert: AlertController,
  ) {}

  ngOnInit() {
    combineLatest([
      this.playerCoins$,
      this.playerLocation$,
      this.playerLevel$,
      this.collectibles$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([coins, location, level, collectibles]) => {
        this.currentCoins = coins;
        this.currentLocation = location.current;
        this.currentLevel = level;
        this.currentWalkTo = location.goingTo;
        this.collectibles = collectibles;
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
      this.locations.find((y) => y.name === x.name),
    ).length;
  }

  async walkToLocation(location: ILocation) {
    const alert = await this.alert.create({
      header: 'Walk to Location',
      message: `Are you sure you want to walk to ${
        location.name
      } in ${location.steps.toLocaleString()} steps?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Walk',
          handler: () => this.gameplayService.walk(location.name).subscribe(),
        },
      ],
    });

    await alert.present();
  }

  async travelToLocation(location: ILocation) {
    const alert = await this.alert.create({
      header: 'Travel to Location',
      message: `Are you sure you want to travel to ${
        location.name
      } for ${location.cost.toLocaleString()} coins?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Travel',
          handler: () => this.gameplayService.travel(location.name).subscribe(),
        },
      ],
    });

    await alert.present();
  }

  numCollectiblesDiscoveredAt(location: ILocation): number {
    return Object.keys(this.collectibles).filter(
      (id) =>
        this.contentService.getCollectible(id)?.location === location.name,
    ).length;
  }

  maxCollectiblesAtLocation(location: ILocation): number {
    return this.contentService
      .getAllCollectibles()
      .filter((coll) => coll.location === location.name).length;
  }
}
