import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNotificationLive } from '@helpers/notifications';
import { xpForLevel } from '@helpers/xp';
import { IFight, INotification, IPlayer } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { ActionsService } from '@services/actions.service';
import { NotificationsService } from '@services/notifications.service';
import { FightStore, NotificationsStore, PlayerStore } from '@stores';
import {
  MarkAllNotificationsRead,
  MarkNotificationRead,
} from '@stores/notifications/notifications.actions';
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
  @Select(FightStore.fight) fight$!: Observable<IFight>;

  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationsService,
    public actionsService: ActionsService,
  ) {}

  ngOnInit() {}

  nextLevelXp(level: number) {
    return xpForLevel(level + 1);
  }

  trackBy(index: number, item: INotification) {
    return item.id;
  }

  markAllNotificationsRead() {
    this.store.dispatch(new MarkAllNotificationsRead());
    this.notificationService.markAllRead().subscribe();
  }

  markNotificationRead(notification: INotification) {
    if (notification.read) return;

    this.store.dispatch(new MarkNotificationRead(notification.id || ''));
    this.notificationService.markRead(notification.id || '').subscribe();
  }

  unreadNotificationCount(notifications: INotification[]) {
    return this.filterNotifications(notifications).filter((n) => !n.read)
      .length;
  }

  filterNotifications(notifications: INotification[]) {
    return notifications.filter((n) => isNotificationLive(n));
  }
}
