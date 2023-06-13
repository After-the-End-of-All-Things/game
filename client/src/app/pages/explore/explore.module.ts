import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { ExplorePage } from './explore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorePageRoutingModule,
    SharedModule,
  ],
  declarations: [ExplorePage],
})
export class ExplorePageModule {}
