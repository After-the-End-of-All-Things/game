import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CardOnlineUsersComponent } from 'src/app/components/card-online-users/card-online-users.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { IconComponent } from './components/icon/icon.component';
import { StoreTextComponent } from './components/store-text/store-text.component';

const components = [
  StoreTextComponent,
  IconComponent,
  CardOnlineUsersComponent,
  HeroComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, IonicModule],
})
export class SharedModule {}
