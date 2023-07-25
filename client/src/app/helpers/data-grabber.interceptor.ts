import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  ApplyAchievementsPatches,
  SetAchievements,
} from '@stores/achievements/achievements.actions';
import {
  ApplyCraftingPatches,
  SetCrafting,
} from '@stores/crafting/crafting.actions';
import {
  ApplyDiscoveriesPatches,
  SetDiscoveries,
} from '@stores/discoveries/discoveries.actions';
import {
  ApplyInventoryPatches,
  SetInventory,
} from '@stores/inventory/inventory.actions';
import { SetNotifications } from '@stores/notifications/notifications.actions';
import { ApplyPlayerPatches, SetPlayer } from '@stores/player/player.actions';
import { ApplyStatsPatches, SetStats } from '@stores/stats/stats.actions';
import { ApplyUserPatches, SetUser } from '@stores/user/user.actions';
import { isArray } from 'lodash';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DataGrabberInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((data: any) => {
        const body = data.body;
        if (!body) return;

        if (body.user) {
          if (isArray(body.user)) {
            if (body.user.length > 0) {
              this.store.dispatch(new ApplyUserPatches(body.user));
            }
          } else {
            this.store.dispatch(new SetUser(body.user));
          }
        }

        if (body.player) {
          if (isArray(body.player)) {
            if (body.player.length > 0) {
              this.store.dispatch(new ApplyPlayerPatches(body.player));
            }
          } else {
            this.store.dispatch(new SetPlayer(body.player));
          }
        }

        if (body.stats) {
          if (isArray(body.stats)) {
            if (body.stats.length > 0) {
              this.store.dispatch(new ApplyStatsPatches(body.stats));
            }
          } else {
            this.store.dispatch(new SetStats(body.stats));
          }
        }

        if (body.achievements) {
          if (isArray(body.achievements)) {
            if (body.achievements.length > 0) {
              this.store.dispatch(
                new ApplyAchievementsPatches(body.achievements),
              );
            }
          } else {
            this.store.dispatch(new SetAchievements(body.achievements));
          }
        }

        if (body.discoveries) {
          if (isArray(body.discoveries)) {
            if (body.discoveries.length > 0) {
              this.store.dispatch(
                new ApplyDiscoveriesPatches(body.discoveries),
              );
            }
          } else {
            this.store.dispatch(new SetDiscoveries(body.discoveries));
          }
        }

        if (body.crafting) {
          if (isArray(body.crafting)) {
            if (body.crafting.length > 0) {
              this.store.dispatch(new ApplyCraftingPatches(body.crafting));
            }
          } else {
            this.store.dispatch(new SetCrafting(body.crafting));
          }
        }

        if (body.inventory) {
          if (isArray(body.inventory)) {
            if (body.inventory.length > 0) {
              this.store.dispatch(new ApplyInventoryPatches(body.inventory));
            }
          } else {
            this.store.dispatch(new SetInventory(body.inventory));
          }
        }

        if (body.notifications) {
          this.store.dispatch(new SetNotifications(body.notifications));
        }

        if (body.actions) {
          this.store.dispatch(body.actions);
        }
      }),
    );
  }
}
