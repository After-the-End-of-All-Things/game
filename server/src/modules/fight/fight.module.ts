import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { Fight } from '@modules/fight/fight.schema';
import { FightService } from '@modules/fight/fight.service';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { PlayerModule } from '@modules/player/player.module';
import { StatsModule } from '@modules/stats/stats.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { FightController } from './fight.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Fight]),
    PlayerModule,
    UserModule,
    InventoryModule,
    ContentModule,
    DiscoveriesModule,
    StatsModule,
  ],
  controllers: [FightController],
  providers: [FightService],
  exports: [FightService],
})
export class FightModule {}
