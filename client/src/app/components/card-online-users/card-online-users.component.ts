import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@services/user.service';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-card-online-users',
  templateUrl: './card-online-users.component.html',
  styleUrls: ['./card-online-users.component.scss'],
})
export class CardOnlineUsersComponent implements OnInit {
  public onlineUsers = 0;

  constructor(private userService: UserService) {
    timer(0, 1000 * 60 * 5)
      .pipe(switchMap(() => this.userService.getOnlineUsers()))
      .pipe(takeUntilDestroyed())
      .subscribe((d: any) => {
        this.onlineUsers = d.users;
      });
  }

  ngOnInit() {}
}
