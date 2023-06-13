import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualService {
  private xp = new Subject<number>();
  private coin = new Subject<number>();

  public xp$ = this.xp.asObservable();
  public coin$ = this.coin.asObservable();

  private xpTimeout!: ReturnType<typeof setTimeout>;
  private coinTimeout!: ReturnType<typeof setTimeout>;

  constructor() {}

  showXpGain(xpGained: number) {
    this.xp.next(xpGained);

    clearTimeout(this.xpTimeout);
    this.xpTimeout = setTimeout(() => {
      this.xp.next(0);
    }, 2000);
  }

  showCoinGain(coinGained: number) {
    this.coin.next(coinGained);

    clearTimeout(this.coinTimeout);
    this.coinTimeout = setTimeout(() => {
      this.coin.next(0);
    }, 2000);
  }
}
