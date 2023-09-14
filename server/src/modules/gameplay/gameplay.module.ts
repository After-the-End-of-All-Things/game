import { ContentModule } from '@modules/content/content.module';
import { CraftingModule } from '@modules/crafting/crafting.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { FightModule } from '@modules/fight/fight.module';
import { GameplayController } from '@modules/gameplay/gameplay.controller';
import { GameplayService } from '@modules/gameplay/gameplay.service';
import { WaveService } from '@modules/gameplay/wave.service';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { PlayerModule } from '@modules/player/player.module';
import { StatsModule } from '@modules/stats/stats.module';
import { WaveModule } from '@modules/wave/wave.module';
import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { NpcService } from './npc.service';
import { TravelService } from './travel.service';

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
    FightModule,
    WaveModule,
  ],
  providers: [
    GameplayService,
    TravelService,
    ItemService,
    NpcService,
    WaveService,
  ],
  exports: [
    GameplayService,
    TravelService,
    ItemService,
    NpcService,
    WaveService,
  ],
})
export class GameplayModule {}
