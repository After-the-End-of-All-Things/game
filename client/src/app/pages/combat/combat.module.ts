import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CombatPageRoutingModule } from './combat-routing.module';

import { SharedModule } from 'src/app/shared.module';
import { CombatPage } from './combat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CombatPageRoutingModule,
  ],
  declarations: [CombatPage],
})
export class CombatPageModule {}
