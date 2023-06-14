import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TownPage } from './town.page';

const routes: Routes = [
  {
    path: '',
    component: TownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TownPageRoutingModule {}
