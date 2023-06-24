import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { LoggerModule as RollbarModule } from 'nestjs-rollbar';
import { FlushInterceptor } from 'src/utils/flush.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';
import { ContentModule } from './modules/content/content.module';
import { DatabaseModule } from './modules/database/database.module';
import { DiscoveriesModule } from './modules/discoveries/discoveries.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationModule } from './modules/notification/notification.module';
import { GameplayController } from './modules/player/gameplay.controller';
import { PlayerModule } from './modules/player/player.module';
import { StatsModule } from './modules/stats/stats.module';
import { UserModule } from './modules/user/user.module';

import { ROLLBAR_CONFIG } from '@modules/config/rollbar';
import { UpdateAuthTimeInterceptor } from './utils/updatetime.interceptor';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule,
    RollbarModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ROLLBAR_CONFIG],
      useFactory: (rollbarConfig) => ({
        ...rollbarConfig,
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
              },
            },
        customSuccessMessage: (req) => `${req.method} ${req.url}`,
        serializers: {
          req: (req) => ({
            url: req.url,
            method: req.method,
            params: req.params,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    NotificationModule,
    PlayerModule,
    StatsModule,
    DiscoveriesModule,
    AchievementsModule,
    ContentModule,
    InventoryModule,
  ],
  controllers: [AppController, GameplayController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UpdateAuthTimeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FlushInterceptor,
    },
  ],
})
export class AppModule {}
