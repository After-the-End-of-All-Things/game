import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngxs/store';
import { MarketService } from '@services/market.service';
import { NotificationsService } from '@services/notifications.service';
import { SetClaimCoins } from '@stores/market/market.actions';
import { interval, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private notificationService: NotificationsService,
    private marketService: MarketService,
  ) {}

  public init() {
    this.authIfPossible();
    this.watchToken();
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  private authIfPossible() {
    const lastEmail = localStorage.getItem('lastEmail');
    const lastPassword = localStorage.getItem('lastPassword');
    if (!lastEmail || !lastPassword) return;

    this.login(lastEmail, lastPassword).subscribe(() => {
      this.updateToken();
      this.postLoginActionsAlways();
    });
  }

  private updateToken() {
    if (!this.isAuthenticated()) return;

    this.http
      .get(`${environment.apiUrl}/auth/refresh`)
      .subscribe((res: any) => {
        localStorage.setItem('token', res.access_token);
      });
  }

  private watchToken() {
    interval(5 * 60 * 1000).subscribe(() => this.updateToken());
  }

  public login(email: string, password: string) {
    return this.http
      .post(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res: any) => {
          if (!res.access_token) return;

          localStorage.setItem('lastEmail', email);
          localStorage.setItem('lastPassword', password);
          localStorage.setItem('token', res.access_token);
        }),
      );
  }

  public register(email: string, password: string, username: string) {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      email,
      password,
      username,
    });
  }

  public logout() {
    localStorage.removeItem('lastEmail');
    localStorage.removeItem('lastPassword');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  public postLoginActions() {
    this.router.navigate(['/']);

    this.postLoginActionsAlways();
  }

  private postLoginActionsAlways() {
    this.notificationService.getNotifications();

    this.marketService.getClaimCoins().subscribe((coins) => {
      this.store.dispatch(new SetClaimCoins(coins as number));
    });
  }

  public requestVerificationCode() {
    return this.http.post(`${environment.apiUrl}/auth/verify/request`, {});
  }

  public verifyVerificationCode(code: string) {
    return this.http.post(`${environment.apiUrl}/auth/verify/validate`, {
      code,
    });
  }

  public requestTemporaryPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/forgot`, { email });
  }

  public changeEmail(newEmail: string) {
    return this.http
      .put(`${environment.apiUrl}/auth/email`, {
        newEmail,
      })
      .pipe(
        tap(() => {
          localStorage.setItem('lastEmail', newEmail);
        }),
      );
  }

  public changePassword(newPassword: string) {
    return this.http
      .put(`${environment.apiUrl}/auth/password`, {
        newPassword,
      })
      .pipe(
        tap(() => {
          localStorage.setItem('lastPassword', newPassword);
        }),
      );
  }
}
