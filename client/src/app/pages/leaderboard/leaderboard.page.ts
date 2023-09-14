import { Component } from '@angular/core';
import { IPlayerLocation } from '@interfaces';
import { Select } from '@ngxs/store';
import { LeaderboardService } from '@services/leaderboard.service';
import { PlayerStore } from '@stores';
import { LocalStorage } from 'ngx-webstorage';
import { Observable, first, forkJoin } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage {
  @Select(PlayerStore.playerLocation)
  playerLocation$!: Observable<IPlayerLocation>;

  @LocalStorage() leaderboardType!: 'local' | 'global';

  public location = 'Local';

  public local: Record<string, Array<any>> = {};
  public global: Record<string, Array<any>> = {};

  public current: Array<any> = [];

  constructor(private leaderboard: LeaderboardService) {}

  ionViewDidEnter() {
    if (!this.leaderboardType) this.leaderboardType = 'local';

    this.playerLocation$.pipe(first()).subscribe((location) => {
      this.location = location.current;

      forkJoin([
        this.leaderboard.getLocalLeaderboard(location.current),
        this.leaderboard.getGlobalLeaderboard(),
      ]).subscribe(([local, global]) => {
        this.local = local;
        this.global = global;

        this.parseLeaderboardInformation();
      });
    });
  }

  selectLeaderboard(ev: any) {
    this.leaderboardType = ev.detail.value;

    this.parseLeaderboardInformation();
  }

  parseLeaderboardInformation() {
    const leaderboard =
      this.leaderboardType === 'local' ? this.local : this.global;

    this.current = [];
    Object.keys(leaderboard).forEach((title) => {
      if (leaderboard[title].length === 0) return;

      this.current.push({
        title,
        data: leaderboard[title],
      });
    });
  }
}
