import { Component, OnInit } from '@angular/core';
import { IPlayer, IUser } from '@interfaces';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PlayerStore, UserStore } from 'src/stores';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Select(UserStore.user) user$!: Observable<IUser>;
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

  constructor() {}

  ngOnInit() {}
}
