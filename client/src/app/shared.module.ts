import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { BackgroundArtComponent } from '@components/background-art/background-art.component';
import { CardOnlineUsersComponent } from '@components/card-online-users/card-online-users.component';
import { CountdownComponent } from '@components/countdown/countdown.component';
import { HeaderBarComponent } from '@components/header-bar/header-bar.component';
import { HeroComponent } from '@components/hero/hero.component';
import { IconComponent } from '@components/icon/icon.component';
import { ItemElementsComponent } from '@components/item-elements/item-elements.component';
import { ItemIconComponent } from '@components/item-icon/item-icon.component';
import { ItemRarityComponent } from '@components/item-rarity/item-rarity.component';
import { ItemStatsComponent } from '@components/item-stats/item-stats.component';
import { LocationStatsButtonComponent } from '@components/location-stats-button/location-stats-button.component';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { CompareItemsModalComponent } from '@components/modals/compare-items/compare-items.component';
import { LocationStatsModalComponent } from '@components/modals/location-stats/location-stats.component';
import { MarketModalComponent } from '@components/modals/market/market.component';
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
  CompareItemsModalComponent,
  MarketModalComponent,
  LocationStatsButtonComponent,
  LocationStatsModalComponent,
  HeaderBarComponent,
  AvatarComponent,
  ItemIconComponent,
  ItemRarityComponent,
  ItemStatsComponent,
  ItemElementsComponent,
  BackgroundArtComponent,
  CountdownComponent,
  RelativeTimePipe,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    NgxTippyModule,
  ],
})
export class SharedModule {}
