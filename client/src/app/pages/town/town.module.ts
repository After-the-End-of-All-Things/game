import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TownPageRoutingModule } from './town-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { TownPage } from './town.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TownPageRoutingModule,
    SharedModule,
  ],
  declarations: [TownPage],
})
export class TownPageModule {}
