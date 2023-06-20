import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { InventoryPageRoutingModule } from './inventory-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { InventoryPage } from './inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPageRoutingModule,
    SharedModule,
    NgxDatatableModule,
  ],
  declarations: [InventoryPage],
})
export class InventoryPageModule {}
