import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentPageRoutingModule } from './equipment-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { EquipmentPage } from './equipment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentPageRoutingModule,
    SharedModule,
  ],
  declarations: [EquipmentPage],
})
export class EquipmentPageModule {}
