import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CombatPage } from './combat.page';

const routes: Routes = [
  {
    path: '',
    component: CombatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CombatPageRoutingModule {}
