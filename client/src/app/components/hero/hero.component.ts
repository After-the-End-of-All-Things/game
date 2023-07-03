import { Component, OnInit } from '@angular/core';
import { IPlayer, IUser } from '@interfaces';
import { Select } from '@ngxs/store';
import { PlayerStore, UserStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Select(UserStore.user) user$!: Observable<IUser>;
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(PlayerStore.playerCoins) playerCoins$!: Observable<number>;
  @Select(PlayerStore.playerOats) playerOats$!: Observable<number>;

  ngOnInit() {}
}
