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

  public dailyReset() {
    return this.http.get(`${environment.apiUrl}/game/dailyreset`);
  }

  public didIWinDailyLotteryToday() {
    return this.http.get(`${environment.apiUrl}/lottery/daily/didiwintoday`);
  }

  public claimDailyRewards() {
    return this.http.post(`${environment.apiUrl}/lottery/daily/claim`, {});
  }

  public jackpotValue() {
    return this.http.get(`${environment.apiUrl}/lottery/buyin/value`);
  }

  public buyinTicketNumbers() {
    return this.http.get(`${environment.apiUrl}/lottery/buyin/tickets`);
  }

  public didIWinBuyInLotteryToday() {
    return this.http.get(`${environment.apiUrl}/lottery/buyin/didiwintoday`);
  }

  public buyTicket() {
    return this.http.post(`${environment.apiUrl}/lottery/buyin/tickets`, {});
  }

  public claimBuyInRewards() {
    return this.http.post(`${environment.apiUrl}/lottery/buyin/claim`, {});
  }
}
