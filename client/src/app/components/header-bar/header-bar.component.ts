import { Component, OnInit } from '@angular/core';
import { xpForLevel } from '@helpers/xp';
import { IPlayer } from '@interfaces';
import { Select } from '@ngxs/store';
import { PlayerStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

  constructor() {}

  ngOnInit() {}

  nextLevelXp(level: number) {
    return xpForLevel(level + 1);
  }
}
