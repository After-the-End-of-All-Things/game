import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelPageRoutingModule } from './travel-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { TravelPage } from './travel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelPageRoutingModule,
    SharedModule,
  ],
  declarations: [TravelPage],
})
export class TravelPageModule {}
