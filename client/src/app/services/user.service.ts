import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getOnlineUsers() {
    return this.http.get(`${environment.apiUrl}/user/online`);
  }

  public getDiscoveries() {
    return this.http.get(`${environment.apiUrl}/discoveries/mine`);
  }

  public didIWinLotteryToday() {
    return this.http.get(`${environment.apiUrl}/lottery/didiwintoday`);
  }

  public claimDailyRewards() {
    return this.http.get(`${environment.apiUrl}/lottery/claimdailyrewards`);
  }
}
