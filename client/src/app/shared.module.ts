import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardOnlineUsersComponent } from '@components/card-online-users/card-online-users.component';
import { HeaderBarComponent } from '@components/header-bar/header-bar.component';
import { HeroComponent } from '@components/hero/hero.component';
import { IconComponent } from '@components/icon/icon.component';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { StoreTextComponent } from '@components/store-text/store-text.component';
import { RelativeTimePipe } from '@helpers/relativetime.pipe';
import { IonicModule } from '@ionic/angular';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

const components = [
  StoreTextComponent,
  IconComponent,
  CardOnlineUsersComponent,
  HeroComponent,
  ChooseAvatarModalComponent,
  HeaderBarComponent,
  RelativeTimePipe,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, IonicModule, RouterModule, NgxTippyModule],
})
export class SharedModule {}
