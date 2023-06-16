import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MePageRoutingModule } from './me-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { MePage } from './me.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MePageRoutingModule,
    SharedModule,
  ],
  declarations: [MePage],
})
export class MePageModule {}
