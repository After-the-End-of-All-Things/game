import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CraftingPageRoutingModule } from './crafting-routing.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { SharedModule } from 'src/app/shared.module';
import { CraftingPage } from './crafting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgxDatatableModule,
    NgxTippyModule,
    CraftingPageRoutingModule,
  ],
  declarations: [CraftingPage],
})
export class CraftingPageModule {}
