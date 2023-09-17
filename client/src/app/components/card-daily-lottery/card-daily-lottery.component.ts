import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@services/user.service';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-card-daily-lottery',
  templateUrl: './card-daily-lottery.component.html',
  styleUrls: ['./card-daily-lottery.component.scss'],
})
export class CardDailyLotteryComponent implements OnInit {
  public didIWin = false;

  constructor(private userService: UserService) {
    timer(0, 1000 * 60 * 5)
      .pipe(switchMap(() => this.userService.didIWinLotteryToday()))
      .pipe(takeUntilDestroyed())
      .subscribe((d: any) => {
        this.didIWin = d;
      });
  }

  ngOnInit() {}

  claimDailyRewards() {
    this.userService.claimDailyRewards().subscribe(() => {
      this.didIWin = false;
    });
  }
}
