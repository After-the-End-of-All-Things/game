import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorshipPageRoutingModule } from './worship-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { WorshipPage } from './worship.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    WorshipPageRoutingModule,
  ],
  declarations: [WorshipPage],
})
export class WorshipPageModule {}
