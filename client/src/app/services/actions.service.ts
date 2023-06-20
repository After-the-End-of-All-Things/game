import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { INotification, INotificationAction } from '@interfaces';
import { Store } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { NotificationsService } from '@services/notifications.service';
import { ClearNotificationActions } from '@stores/notifications/notifications.actions';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationsService,
    private gameplayService: GameplayService,
  ) {}

  doAction(action: INotificationAction, notification?: INotification) {
    if (notification) {
      this.notificationService.clearActions(notification.id || '').subscribe();
      this.store.dispatch(new ClearNotificationActions(notification.id || ''));
    }

    if (action.action === 'navigate') {
      this.router.navigate([action.actionData.url]);
    }

    if (action.action === 'wave') {
      this.gameplayService.wave(action.actionData.player.userId).subscribe();
    }

    if (action.action === 'waveback') {
      this.gameplayService
        .wave(action.actionData.player.userId, true)
        .subscribe();
    }

    if (action.action === 'collectible' || action.action === 'item') {
      this.gameplayService.takeitem().subscribe();
    }
  }
}
