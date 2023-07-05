import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { FlushInterceptor } from 'src/utils/flush.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';
import { ContentModule } from './modules/content/content.module';
import { DatabaseModule } from './modules/database/database.module';
import { DiscoveriesModule } from './modules/discoveries/discoveries.module';
import { GameplayController } from './modules/gameplay/gameplay.controller';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlayerModule } from './modules/player/player.module';
import { StatsModule } from './modules/stats/stats.module';
import { UserModule } from './modules/user/user.module';

import { JWT_CONFIG } from '@modules/config/jwt-config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@utils/http-exception.filter';
import { GameplayModule } from './modules/gameplay/gameplay.module';
import { UpdateAuthTimeInterceptor } from './utils/updatetime.interceptor';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule,
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
    EventEmitterModule.forRoot(),
    GameplayModule,
    {
      ...JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [JWT_CONFIG],
        useFactory: (jwtConfig) => ({
          ...jwtConfig,
        }),
      }),
      global: true,
    },
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
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
