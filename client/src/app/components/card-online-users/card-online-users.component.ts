import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-online-users',
  templateUrl: './card-online-users.component.html',
  styleUrls: ['./card-online-users.component.scss'],
})
export class CardOnlineUsersComponent implements OnInit {
  public onlineUsers = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getOnlineUsers().subscribe((d: any) => {
      this.onlineUsers = d.users;
    });
  }
}
