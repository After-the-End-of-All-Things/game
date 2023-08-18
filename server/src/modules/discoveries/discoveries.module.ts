import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { FightModule } from '@modules/fight/fight.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { PlayerModule } from '@modules/player/player.module';
import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Discoveries]),
    ContentModule,
    InventoryModule,
    PlayerModule,
    FightModule,
  ],
  controllers: [DiscoveriesController],
  providers: [DiscoveriesService],
  exports: [DiscoveriesService],
})
export class DiscoveriesModule {}
