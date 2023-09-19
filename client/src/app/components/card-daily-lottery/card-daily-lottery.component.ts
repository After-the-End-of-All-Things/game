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
  public nextDraw!: Date;

  constructor(private userService: UserService) {
    timer(0, 1000 * 60 * 5)
      .pipe(switchMap(() => this.userService.didIWinDailyLotteryToday()))
      .pipe(takeUntilDestroyed())
      .subscribe((d: any) => {
        this.didIWin = d;
      });
  }

  ngOnInit() {
    this.userService.nextLotteryDraw().subscribe((d: any) => {
      this.nextDraw = new Date(d);
    });
  }

  claimDailyRewards() {
    this.userService.claimDailyRewards().subscribe(() => {
      this.didIWin = false;
    });
  }
}
