import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { AwardListComponent } from '@components/award-list/award-list.component';
import { AwardComponent } from '@components/award/award.component';
import { BackgroundArtComponent } from '@components/background-art/background-art.component';
import { CardBuyinLotteryComponent } from '@components/card-buyin-lottery/card-buyin-lottery.component';
import { CardDailyLotteryComponent } from '@components/card-daily-lottery/card-daily-lottery.component';
import { CardOnlineUsersComponent } from '@components/card-online-users/card-online-users.component';
import { CombatAbilityComponent } from '@components/combat-ability/combat-ability.component';
import { CountdownComponent } from '@components/countdown/countdown.component';
import { ElementIconComponent } from '@components/element-icon/element-icon.component';
import { GameIconComponent } from '@components/game-icon/game-icon.component';
import { HeaderBarComponent } from '@components/header-bar/header-bar.component';
import { HeroComponent } from '@components/hero/hero.component';
import { IconComponent } from '@components/icon/icon.component';
import { ItemDisplayComponent } from '@components/item-display/item-display.component';
import { ItemIconComponent } from '@components/item-icon/item-icon.component';
import { ItemRarityComponent } from '@components/item-rarity/item-rarity.component';
import { ItemStatsComponent } from '@components/item-stats/item-stats.component';
import { LocationStatsButtonComponent } from '@components/location-stats-button/location-stats-button.component';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { ChooseBackgroundComponent } from '@components/modals/choose-background/choose-background.component';
import { CompareItemsModalComponent } from '@components/modals/compare-items/compare-items.component';
import { LocationStatsModalComponent } from '@components/modals/location-stats/location-stats.component';
import { MarketModalComponent } from '@components/modals/market/market.component';
import { MonsterIconComponent } from '@components/monster-icon/monster-icon.component';
import { StoreTextComponent } from '@components/store-text/store-text.component';
import { RelativeTimePipe } from '@helpers/relativetime.pipe';
import { IonicModule } from '@ionic/angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

const components = [
  StoreTextComponent,
  IconComponent,
  CardOnlineUsersComponent,
  HeroComponent,
  ChooseAvatarModalComponent,
  ChooseBackgroundComponent,
  CompareItemsModalComponent,
  MarketModalComponent,
  LocationStatsButtonComponent,
  LocationStatsModalComponent,
  HeaderBarComponent,
  AvatarComponent,
  ItemIconComponent,
  MonsterIconComponent,
  ItemRarityComponent,
  ItemStatsComponent,
  BackgroundArtComponent,
  CountdownComponent,
  RelativeTimePipe,
  ElementIconComponent,
  CombatAbilityComponent,
  GameIconComponent,
  ItemDisplayComponent,
  CardDailyLotteryComponent,
  CardBuyinLotteryComponent,
  AwardListComponent,
  AwardComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    AngularSvgIconModule,
    NgxTippyModule,
  ],
})
export class SharedModule {}
