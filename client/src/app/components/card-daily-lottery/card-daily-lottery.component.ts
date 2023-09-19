import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-card-daily-lottery',
  templateUrl: './card-daily-lottery.component.html',
  styleUrls: ['./card-daily-lottery.component.scss'],
})
export class CardDailyLotteryComponent implements OnInit {
  public didIWin = false;
  public nextDraw!: Date;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.didIWinToday();

    this.userService.nextLotteryDraw().subscribe((d: any) => {
      this.nextDraw = new Date(d);
    });
  }

  didIWinToday() {
    this.userService.didIWinDailyLotteryToday().subscribe((d: any) => {
      this.didIWin = d;
    });
  }

  claimDailyRewards() {
    this.userService.claimDailyRewards().subscribe(() => {
      this.didIWin = false;
    });
  }
}
