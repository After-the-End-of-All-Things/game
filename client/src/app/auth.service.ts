import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngxs/store';
import { interval, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { SetUser } from '../stores/user/user.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store: Store, private http: HttpClient, private jwtHelper: JwtHelperService) {
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
    if(!lastEmail || !lastPassword) return;

    this.login(lastEmail, lastPassword).subscribe(() => {
      this.updateToken();
    });
  }

  private updateToken() {
    if(!this.isAuthenticated()) return;

    this.http.get(`${environment.apiUrl}/auth/refresh`).subscribe((res: any) => {
      localStorage.setItem('token', res.access_token);
    });
  }

  private watchToken() {
    interval(5 * 60 * 1000).subscribe(() => this.updateToken());
  }

  public login(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res: any) => {
        if(!res.access_token) return;

        this.store.dispatch(new SetUser(res.user));

        localStorage.setItem('lastEmail', email);
        localStorage.setItem('lastPassword', password);
        localStorage.setItem('token', res.access_token);
      }));
  }

  public register(email: string, password: string, username: string) {
    return this.http.post(`${environment.apiUrl}/auth/register`, { email, password, username });
  }
}
