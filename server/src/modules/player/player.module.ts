import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PlayerController } from '@modules/player/player.controller';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PlayerController],
  imports: [MikroOrmModule.forFeature([Player])],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
