import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { NotifyService } from '../services/notify.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notify: NotifyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';

          // client side error
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error?.message || error.message}`;

          // server side error
          } else {
            errorMsg = `Error: ${error.error?.message || error.message}`;
          }

          if(!request.url.includes('/auth/')) {
            this.notify.error(errorMsg);
          }

          return throwError(error);
        })
    );
  }
}
