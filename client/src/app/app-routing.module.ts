import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./pages/explore/explore.module').then((m) => m.ExplorePageModule),
  },
  {
    path: 'travel',
    loadChildren: () =>
      import('./pages/travel/travel.module').then((m) => m.TravelPageModule),
  },
  {
    path: 'town',
    loadChildren: () =>
      import('./pages/town/town.module').then((m) => m.TownPageModule),
  },
  {
    path: 'me',
    loadChildren: () =>
      import('./pages/me/me.module').then((m) => m.MePageModule),
  },
  {
    path: 'options',
    loadChildren: () =>
      import('./pages/options/options.module').then((m) => m.OptionsPageModule),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./pages/inventory/inventory.module').then(
        (m) => m.InventoryPageModule,
      ),
  },
  {
    path: 'equipment',
    loadChildren: () =>
      import('./pages/equipment/equipment.module').then(
        (m) => m.EquipmentPageModule,
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
