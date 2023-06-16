import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { INotification } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { NotificationsStore } from '@stores';
import { Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  readonly intervalMinutes = 1;

  @Select(NotificationsStore.notifications) notifications$!: Observable<
    INotification[]
  >;

  constructor(private store: Store, private http: HttpClient) {}

  init() {
    timer(0, 1000 * 60 * this.intervalMinutes).subscribe(() => {
      const notifications = this.store.selectSnapshot(
        NotificationsStore.notifications,
      );

      if (notifications.length > 0) {
        this.getNotificationsAfter(
          new Date(notifications[0].createdAt),
        ).subscribe();
        return;
      }

      this.getNotifications().subscribe();
    });
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
