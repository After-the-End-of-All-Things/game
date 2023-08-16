import { AchievementsModule } from '@modules/achievements/achievements.module';
import { CraftingModule } from '@modules/crafting/crafting.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { FightModule } from '@modules/fight/fight.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { PlayerModule } from '@modules/player/player.module';
import { StatsModule } from '@modules/stats/stats.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';

@Module({
  imports: [
    PlayerModule,
    StatsModule,
    AchievementsModule,
    DiscoveriesModule,
    InventoryModule,
    CraftingModule,
    FightModule,
    UserModule,
  ],
  providers: [AggregatorService],
  exports: [AggregatorService],
})
export class AggregatorModule {}
