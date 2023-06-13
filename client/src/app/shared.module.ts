import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardOnlineUsersComponent } from '@components/card-online-users/card-online-users.component';
import { HeaderBarComponent } from '@components/header-bar/header-bar.component';
import { HeroComponent } from '@components/hero/hero.component';
import { IconComponent } from '@components/icon/icon.component';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { StoreTextComponent } from '@components/store-text/store-text.component';
import { IonicModule } from '@ionic/angular';

const components = [
  StoreTextComponent,
  IconComponent,
  CardOnlineUsersComponent,
  HeroComponent,
  ChooseAvatarModalComponent,
  HeaderBarComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class SharedModule {}
