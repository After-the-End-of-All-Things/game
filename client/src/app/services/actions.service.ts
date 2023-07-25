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

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationsService,
  ) {}

  doAction(action: INotificationAction, notification?: INotification) {
    if (action.url) {
      // we never send data here, it's inferred server side
      this.http.post(`${environment.apiUrl}/${action.url}`, {}).subscribe();
    }

    if (action.clearActionsForUrl) {
      this.store.dispatch(
        new ClearNotificationActionsMatchingUrl(action.clearActionsForUrl),
      );
    }

    if (notification) {
      this.notificationService.clearActions(notification.id || '').subscribe();
      this.store.dispatch(new ClearNotificationActions(notification.id || ''));
    }

    if (action.action === 'navigate') {
      this.router.navigate([action.actionData.url]);
    }
  }
}
