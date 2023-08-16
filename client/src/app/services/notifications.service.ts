import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { Store } from '@ngxs/store';
import { AddNotification } from '@stores/notifications/notifications.actions';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  readonly intervalMinutes = 1;

  private notificationEvents!: EventSource;

  constructor(private store: Store, private http: HttpClient) {}

  init() {
    this.initEvents();
  }

  initEvents() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.getNotifications().subscribe();

    this.notificationEvents = new EventSource(
      `${environment.apiUrl}/notification/sse/${token}`,
    );

    this.notificationEvents.onmessage = (data) => {
      if (!data.data) return;

      this.store.dispatch(new AddNotification(JSON.parse(data.data)));
    };
  }

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
