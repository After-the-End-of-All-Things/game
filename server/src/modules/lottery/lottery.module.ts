import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { DailyRandomLottery } from '@modules/lottery/dailylottery.schema';
import { PlayerModule } from '@modules/player/player.module';
import { Module } from '@nestjs/common';
import { LotteryController } from './lottery.controller';
import { LotteryService } from './lottery.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([DailyRandomLottery]),
    PlayerModule,
    ContentModule,
  ],
  providers: [LotteryService],
  controllers: [LotteryController],
})
export class LotteryModule {}
