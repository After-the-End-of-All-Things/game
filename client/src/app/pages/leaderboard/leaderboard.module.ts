import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaderboardPageRoutingModule } from './leaderboard-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { LeaderboardPage } from './leaderboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LeaderboardPageRoutingModule,
  ],
  declarations: [LeaderboardPage],
})
export class LeaderboardPageModule {}
