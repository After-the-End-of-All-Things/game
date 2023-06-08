import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { SetPlayer } from 'src/stores/player/player.actions';
import { SetStats } from 'src/stores/stats/stats.actions';
import { SetUser } from 'src/stores/user/user.actions';

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
          this.store.dispatch(new SetUser(body.user));
        }

        if (body.player) {
          this.store.dispatch(new SetPlayer(body.player));
        }

        if (body.stats) {
          this.store.dispatch(new SetStats(body.stats));
        }
      })
    );
  }
}
