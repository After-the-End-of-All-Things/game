import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, timer } from 'rxjs';
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
      indicator: timer(0, 1000).pipe(
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
          this.titleService.setTitle(`${data} | AtEoAT`);
        } else {
          this.titleService.setTitle('After the End of All Things');
        }
      });
  }
}
