import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionsPageRoutingModule } from './collections-routing.module';

import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { SharedModule } from 'src/app/shared.module';
import { CollectionsPage } from './collections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionsPageRoutingModule,
    SharedModule,
    NgxTippyModule,
  ],
  declarations: [CollectionsPage],
})
export class CollectionsPageModule {}
