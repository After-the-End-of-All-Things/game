import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcesPageRoutingModule } from './resources-routing.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared.module';
import { ResourcesPage } from './resources.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourcesPageRoutingModule,
    SharedModule,
    NgxDatatableModule,
  ],
  declarations: [ResourcesPage],
})
export class ResourcesPageModule {}
