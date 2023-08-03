import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContentModule } from '@modules/content/content.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { MarketItem } from '@modules/market/marketitem.schema';
import { MarketSale } from '@modules/market/marketsale.schema';
import { PlayerModule } from '@modules/player/player.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([MarketItem, MarketSale]),
    PlayerModule,
    InventoryModule,
    ContentModule,
    UserModule,
  ],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {}
