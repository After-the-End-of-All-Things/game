import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GrabData } from '@stores/user/user.actions';
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

        this.store.dispatch(new GrabData(body));
      }),
    );
  }
}
