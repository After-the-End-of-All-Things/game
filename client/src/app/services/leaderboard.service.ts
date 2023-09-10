import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  constructor(private http: HttpClient) {}

  getLocalLeaderboard(location: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/leaderboard/local?location=${location}`,
    );
  }

  getGlobalLeaderboard() {
    return this.http.get<any>(`${environment.apiUrl}/leaderboard/global`);
  }
}
