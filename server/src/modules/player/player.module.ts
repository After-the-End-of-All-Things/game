import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { NpcService } from '@modules/player/npc.service';
import { PlayerController } from '@modules/player/player.controller';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { WaveModule } from '@modules/wave/wave.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PlayerController],
  imports: [
    MikroOrmModule.forFeature([Player]),
    ContentModule,
    InventoryModule,
    DiscoveriesModule,
    WaveModule,
  ],
  providers: [PlayerService, NpcService],
  exports: [PlayerService],
})
export class PlayerModule {}
