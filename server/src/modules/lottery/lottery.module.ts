import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { LotteryBuyInTicket } from '@modules/lottery/buyinlottery.schema';
import { BuyInLotteryService } from '@modules/lottery/buyinlottery.service';
import { LotteryBuyInDraw } from '@modules/lottery/buyinlotterydraw.schema';
import { LotteryRandomDaily } from '@modules/lottery/dailylottery.schema';
import { PlayerModule } from '@modules/player/player.module';
import { Module } from '@nestjs/common';
import { DailyLotteryService } from './dailylottery.service';
import { LotteryController } from './lottery.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      LotteryRandomDaily,
      LotteryBuyInTicket,
      LotteryBuyInDraw,
    ]),
    PlayerModule,
    ContentModule,
  ],
  providers: [DailyLotteryService, BuyInLotteryService],
  controllers: [LotteryController],
})
export class LotteryModule {}
