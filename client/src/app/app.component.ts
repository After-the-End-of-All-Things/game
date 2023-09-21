import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '@environment';
import { IPlayer, IUser } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { MarketService } from '@services/market.service';
import { PlayerStore, UserStore } from '@stores';
import { Observable, combineLatest, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

interface IMenuItem {
  title: string;
  url: string;
  icon: string;
  indicator?: Observable<
    { icon: string; tooltip: string; color: string } | undefined
  >;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @Select(UserStore.user) user$!: Observable<IUser>;
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(PlayerStore.playerCoins) playerCoins$!: Observable<number>;
  @Select(PlayerStore.playerOats) playerOats$!: Observable<number>;

  public appPages: IMenuItem[] = [
    {
      title: 'Home',
      url: '',
      icon: 'home',
    },
    {
      title: 'Town',
      url: 'town',
      icon: 'town',
      indicator: combineLatest([
        timer(0, 1000).pipe(
          switchMap(() =>
            this.store.select((state) =>
              state.market.claimCoins > 0
                ? {
                    color: 'primary',
                    icon: 'global-important',
                    tooltip: 'Crafting complete!',
                  }
                : undefined,
            ),
          ),
        ),
        this.marketService.claimedCoins$,
        timer(0, 1000).pipe(
          switchMap(() =>
            this.store.select((state) =>
              state.crafting.crafting.currentlyCraftingDoneAt > 0 &&
              state.crafting.crafting.currentlyCraftingDoneAt < Date.now()
                ? {
                    color: 'primary',
                    icon: 'global-important',
                    tooltip: 'Crafting complete!',
                  }
                : undefined,
            ),
          ),
        ),
      ]).pipe(
        map(([claimCoins, didClaimCoins, crafting]) => {
          if (didClaimCoins) return crafting;
          return claimCoins || crafting;
        }),
      ),
    },
  ];

  public characterPages: IMenuItem[] = [
    {
      title: 'My Profile',
      url: 'me',
      icon: 'profile',
    },
    {
      title: 'My Items',
      url: 'inventory',
      icon: 'items',
    },
    {
      title: 'My Equipment',
      url: 'equipment',
      icon: 'equipment',
    },
    {
      title: 'My Resources',
      url: 'resources',
      icon: 'resources',
    },
    {
      title: 'My Collections',
      url: 'collections',
      icon: 'collections',
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private marketService: MarketService,
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data && child.snapshot.data['title']) {
              return child.snapshot.data['title'];
            } else {
              return null;
            }
          }
          return null;
        }),
      )
      .subscribe((data: any) => {
        if (data) {
          const devString = environment.production ? '' : '(dev)';
          this.titleService.setTitle(`${data} | AtEoAT ${devString}`);
          return;
        }

        this.titleService.setTitle('After the End of All Things');
      });
  }
}
