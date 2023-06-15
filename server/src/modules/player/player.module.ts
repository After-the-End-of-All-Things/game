import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { GameplayController } from '@modules/player/gameplay.controller';
import { GameplayService } from '@modules/player/gameplay.service';
import { PlayerController } from '@modules/player/player.controller';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PlayerController, GameplayController],
  imports: [
    MikroOrmModule.forFeature([Player]),
    ContentModule,
    DiscoveriesModule,
    NotificationModule,
  ],
  providers: [PlayerService, GameplayService],
  exports: [PlayerService, GameplayService],
})
export class PlayerModule {}
