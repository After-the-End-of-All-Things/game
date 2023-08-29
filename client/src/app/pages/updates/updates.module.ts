import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatesPageRoutingModule } from './updates-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { UpdatesPage } from './updates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    UpdatesPageRoutingModule,
  ],
  declarations: [UpdatesPage],
})
export class UpdatesPageModule {}
