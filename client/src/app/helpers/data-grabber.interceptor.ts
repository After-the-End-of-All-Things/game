import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
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
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((data: any) => {
        const body = data.body;
        if (!body) return;

        if (body.user) {
          if (isArray(body.user)) {
            this.store.dispatch(new ApplyUserPatches(body.user));
          } else {
            this.store.dispatch(new SetUser(body.user));
          }
        }

        if (body.player) {
          if (isArray(body.player)) {
            this.store.dispatch(new ApplyPlayerPatches(body.player));
          } else {
            this.store.dispatch(new SetPlayer(body.player));
          }
        }

        if (body.stats) {
          if (isArray(body.stats)) {
            this.store.dispatch(new ApplyStatsPatches(body.stats));
          } else {
            this.store.dispatch(new SetStats(body.stats));
          }
        }
      })
    );
  }
}
