import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CraftingPage } from './crafting.page';

const routes: Routes = [
  {
    path: '',
    component: CraftingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CraftingPageRoutingModule {}
