import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { xpForLevel } from '@helpers/xp';
import { INotification, INotificationAction, IPlayer } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { NotificationsService } from '@services/notifications.service';
import { NotificationsStore, PlayerStore } from '@stores';
import { MarkNotificationRead } from '@stores/notifications/notifications.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(NotificationsStore.notifications) notifications$!: Observable<
    INotification[]
  >;
  @Select(NotificationsStore.notificationCount)
  notificationCount$!: Observable<number>;

  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationsService,
  ) {}

  ngOnInit() {}

  nextLevelXp(level: number) {
    return xpForLevel(level + 1);
  }

  trackBy(index: number, item: INotification) {
    return item.id;
  }

  markAllNotificationsRead(notifications: INotification[]) {
    this.store.dispatch(
      notifications.map((n) => new MarkNotificationRead(n.id || '')),
    );
    this.notificationService.markAllRead().subscribe();
  }

  markNotificationRead(notification: INotification) {
    if (notification.read) return;

    this.store.dispatch(new MarkNotificationRead(notification.id || ''));
    this.notificationService.markRead(notification.id || '').subscribe();
  }

  doNotificationAction(notificationAction: INotificationAction) {
    if (notificationAction.action === 'navigate') {
      this.router.navigate([notificationAction.actionData.url]);
    }
  }
}
