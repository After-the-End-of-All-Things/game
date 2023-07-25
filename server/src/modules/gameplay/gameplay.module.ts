import { ContentModule } from '@modules/content/content.module';
import { CraftingModule } from '@modules/crafting/crafting.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { GameplayController } from '@modules/gameplay/gameplay.controller';
import { GameplayService } from '@modules/gameplay/gameplay.service';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { PlayerModule } from '@modules/player/player.module';
import { StatsModule } from '@modules/stats/stats.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GameplayController],
  imports: [
    ContentModule,
    DiscoveriesModule,
    NotificationModule,
    StatsModule,
    InventoryModule,
    PlayerModule,
    CraftingModule,
  ],
  providers: [GameplayService],
  exports: [GameplayService],
})
export class GameplayModule {}
