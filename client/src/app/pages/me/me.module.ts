import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MePageRoutingModule } from './me-routing.module';

import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { SharedModule } from 'src/app/shared.module';
import { MePage } from './me.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxTippyModule,
    IonicModule,
    MePageRoutingModule,
    SharedModule,
  ],
  declarations: [MePage],
})
export class MePageModule {}
