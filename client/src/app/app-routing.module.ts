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
    data: { title: 'Login' },
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'explore',
    canActivate: [AuthGuard],
    data: { title: 'Explore' },
    loadChildren: () =>
      import('./pages/explore/explore.module').then((m) => m.ExplorePageModule),
  },
  {
    path: 'travel',
    canActivate: [AuthGuard],
    data: { title: 'Travel' },
    loadChildren: () =>
      import('./pages/travel/travel.module').then((m) => m.TravelPageModule),
  },
  {
    path: 'town',
    canActivate: [AuthGuard],
    data: { title: 'Town' },
    loadChildren: () =>
      import('./pages/town/town.module').then((m) => m.TownPageModule),
  },
  {
    path: 'me',
    canActivate: [AuthGuard],
    data: { title: 'My Profile' },
    loadChildren: () =>
      import('./pages/me/me.module').then((m) => m.MePageModule),
  },
  {
    path: 'options',
    canActivate: [AuthGuard],
    data: { title: 'Options' },
    loadChildren: () =>
      import('./pages/options/options.module').then((m) => m.OptionsPageModule),
  },
  {
    path: 'inventory',
    canActivate: [AuthGuard],
    data: { title: 'Inventory' },
    loadChildren: () =>
      import('./pages/inventory/inventory.module').then(
        (m) => m.InventoryPageModule,
      ),
  },
  {
    path: 'equipment',
    canActivate: [AuthGuard],
    data: { title: 'Equipment' },
    loadChildren: () =>
      import('./pages/equipment/equipment.module').then(
        (m) => m.EquipmentPageModule,
      ),
  },
  {
    path: 'collections',
    canActivate: [AuthGuard],
    data: { title: 'Collections' },
    loadChildren: () =>
      import('./pages/collections/collections.module').then(
        (m) => m.CollectionsPageModule,
      ),
  },
  {
    path: 'resources',
    canActivate: [AuthGuard],
    data: { title: 'Resources' },
    loadChildren: () =>
      import('./pages/resources/resources.module').then(
        (m) => m.ResourcesPageModule,
      ),
  },
  {
    path: 'crafting',
    canActivate: [AuthGuard],
    data: { title: 'Crafting' },
    loadChildren: () =>
      import('./pages/crafting/crafting.module').then(
        (m) => m.CraftingPageModule,
      ),
  },
  {
    path: 'combat',
    canActivate: [AuthGuard],
    data: { title: 'Combat' },
    loadChildren: () =>
      import('./pages/combat/combat.module').then((m) => m.CombatPageModule),
  },
  {
    path: 'updates',
    canActivate: [AuthGuard],
    data: { title: 'Game Updates' },
    loadChildren: () =>
      import('./pages/updates/updates.module').then((m) => m.UpdatesPageModule),
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
