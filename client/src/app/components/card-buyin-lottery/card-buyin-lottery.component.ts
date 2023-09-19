import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@services/user.service';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-card-buyin-lottery',
  templateUrl: './card-buyin-lottery.component.html',
  styleUrls: ['./card-buyin-lottery.component.scss'],
})
export class CardBuyinLotteryComponent implements OnInit {
  public didIWin = false;
  public canBuyTickets = false;
  public jackpot = 0;
  public tickets: string[] = [];

  constructor(private userService: UserService) {
    timer(0, 1000 * 60 * 5)
      .pipe(switchMap(() => this.userService.didIWinBuyInLotteryToday()))
      .pipe(takeUntilDestroyed())
      .subscribe((d: any) => {
        this.didIWin = d;
      });
  }

  ngOnInit() {
    this.refreshTickets();
    this.jackpotValue();
  }

  jackpotValue() {
    this.userService.jackpotValue().subscribe((d: any) => {
      this.jackpot = d;
    });
  }

  buyTicket() {
    this.userService.buyTicket().subscribe(() => {
      this.refreshTickets();
    });
  }

  refreshTickets() {
    this.userService.buyinTicketNumbers().subscribe((d: any) => {
      this.tickets = d;

      this.canBuyTickets = this.tickets.length < 10;
    });
  }

  claimBuyInRewards() {
    this.userService.claimBuyInRewards().subscribe(() => {
      this.didIWin = false;
    });
  }
}
