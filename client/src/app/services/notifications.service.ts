import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  readonly intervalMinutes = 1;

  constructor(private http: HttpClient) {}

  getNotifications() {
    return this.http.get(`${environment.apiUrl}/notification/mine`);
  }

  getNotificationsAfter(date: Date) {
    return this.http.get(`${environment.apiUrl}/notification/mine/after`, {
      params: { after: date.toISOString() },
    });
  }

  markAllRead() {
    return this.http.post(`${environment.apiUrl}/notification/markallread`, {});
  }

  markRead(notificationId: string) {
    return this.http.post(`${environment.apiUrl}/notification/markread`, {
      notificationId,
    });
  }

  clearActions(notificationId: string) {
    return this.http.post(`${environment.apiUrl}/notification/clearactions`, {
      notificationId,
    });
  }
}
