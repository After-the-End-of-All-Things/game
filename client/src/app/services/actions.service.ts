import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { INotification, INotificationAction } from '@interfaces';
import { Store } from '@ngxs/store';
import { NotificationsService } from '@services/notifications.service';
import {
  ClearNotificationActions,
  ClearNotificationActionsMatchingUrl,
} from '@stores/notifications/notifications.actions';
import { GrabData } from '@stores/user/user.actions';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  private events!: EventSource;

  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationsService,
  ) {}

  async init() {
    this.initEvents();
  }

  initEvents() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const ws = io(environment.apiUrl, {
      query: {
        token,
      },
      transports: ['websocket'],
    });

    ws.on('userdata', (event) => {
      this.store.dispatch(new GrabData(event));
    });
  }

  changePage(newPage: string) {
    this.router.navigate([`/${newPage}`]);
  }

  doAction(action: INotificationAction, notification?: INotification) {
    if (action.url) {
      // we never send data here, it's inferred server side
      this.http
        .post(`${environment.apiUrl}/${action.url}`, {})
        .subscribe(() => {
          if (!notification) return;

          this.notificationService
            .clearActions(notification.id || '')
            .subscribe();
          this.store.dispatch(
            new ClearNotificationActions(notification.id || ''),
          );
        });
    }

    if (action.clearActionsForUrl) {
      this.store.dispatch(
        new ClearNotificationActionsMatchingUrl(action.clearActionsForUrl),
      );
    }

    if (action.action === 'navigate') {
      this.router.navigate([action.actionData.url]);
    }
  }
}
