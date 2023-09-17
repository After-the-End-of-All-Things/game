import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Achievements } from '@modules/achievements/achievements.schema';
import { Crafting } from '@modules/crafting/crafting.schema';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Fight } from '@modules/fight/fight.schema';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryItem } from '@modules/inventory/inventoryitem.schema';
import { DailyRandomLottery } from '@modules/lottery/dailylottery.schema';
import { MarketItem } from '@modules/market/marketitem.schema';
import { MarketSale } from '@modules/market/marketsale.schema';
import { Notification } from '@modules/notification/notification.schema';
import { Player } from '@modules/player/player.schema';
import { Stats } from '@modules/stats/stats.schema';
import { User } from '@modules/user/user.schema';
import { PlayerWave } from '@modules/wave/playerwave.schema';
import { ConfigService } from '@nestjs/config';

export const MIKRO_ORM_CONFIG = Symbol('MIKRO_ORM_CONFIG');

function mikroOrmConfigFactory(
  configService: ConfigService,
): MikroOrmModuleOptions {
  const mongoUrl = configService.get<string>(
    'MONGODB_URI',
    'mongodb://127.0.0.1:27017',
  );

  const disableLogging = configService.get<boolean>(
    'DISABLE_DATABASE_LOGGING',
    false,
  );

  return {
    entities: [
      User,
      Notification,
      Player,
      Stats,
      Discoveries,
      Achievements,
      Inventory,
      InventoryItem,
      Crafting,
      MarketItem,
      MarketSale,
      Fight,
      PlayerWave,
      DailyRandomLottery,
    ],
    dbName: process.env.NODE_ENV === 'production' ? 'ateoat' : 'ateoattest',
    type: 'mongo',
    ensureIndexes: true,
    clientUrl: mongoUrl,
    logger: console.log.bind(console),
    debug: !disableLogging,
  };
}

export const mikroOrmConfigProvider = {
  provide: MIKRO_ORM_CONFIG,
  inject: [ConfigService],
  useFactory: mikroOrmConfigFactory,
};
