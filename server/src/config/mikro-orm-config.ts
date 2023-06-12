import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Achievements } from '@modules/achievements/achievements.schema';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Notification } from '@modules/notification/notification.schema';
import { Player } from '@modules/player/player.schema';
import { Stats } from '@modules/stats/stats.schema';
import { User } from '@modules/user/user.schema';
import { ConfigService } from '@nestjs/config';

export const MIKRO_ORM_CONFIG = Symbol('MIKRO_ORM_CONFIG');

function mikroOrmConfigFactory(
  configService: ConfigService,
): MikroOrmModuleOptions {
  const mongoUrl = configService.get<string>(
    'MONGODB_URI',
    'mongodb://localhost:27017',
  );

  return {
    entities: [User, Notification, Player, Stats, Discoveries, Achievements],
    dbName: process.env.NODE_ENV === 'production' ? 'ateoat' : 'ateoattest',
    type: 'mongo',
    ensureIndexes: true,
    clientUrl: mongoUrl,
    logger: console.log.bind(console),
    debug: process.env.NODE_ENV !== 'production',
  };
}

export const mikroOrmConfigProvider = {
  provide: MIKRO_ORM_CONFIG,
  inject: [ConfigService],
  useFactory: mikroOrmConfigFactory,
};
