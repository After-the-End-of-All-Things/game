import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.refreshTickets();
    this.jackpotValue();
    this.didIWinToday();
  }

  didIWinToday() {
    this.userService.didIWinBuyInLotteryToday().subscribe((d: any) => {
      this.didIWin = d;
    });
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
