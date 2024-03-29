import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { FightModule } from '@modules/fight/fight.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@utils/http-exception.filter';
import { isProduction } from '@utils/isprod';
import { AggregatorModule } from './modules/aggregator/aggregator.module';
import { CraftingModule } from './modules/crafting/crafting.module';
import { EmailModule } from './modules/email/email.module';
import { EventsModule } from './modules/events/events.module';
import { GameplayModule } from './modules/gameplay/gameplay.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { LotteryModule } from './modules/lottery/lottery.module';
import { MarketModule } from './modules/market/market.module';
import { WaveModule } from './modules/wave/wave.module';
import { UpdateAuthTimeInterceptor } from './utils/updatetime.interceptor';

const logLevel = process.env.LOG_LEVEL || 'trace';

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        },
        level: logLevel,
        customSuccessMessage: (req) =>
          `${req.method} ${req.url?.includes('sse') ? 'SSE' : req.url}`,
        serializers: {
          req: (req) => ({
            url: req.url.includes('sse') ? 'SSE' : req.url,
            method: req.method,
            params: req.url.includes('sse') ? {} : req.params,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: isProduction() ? 1 : 100,
          ttl: 1000,
        },
      ],
    }),
    NotificationModule,
    PlayerModule,
    StatsModule,
    DiscoveriesModule,
    AchievementsModule,
    ContentModule,
    InventoryModule,
    FightModule,
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
    CraftingModule,
    MarketModule,
    AggregatorModule,
    EventsModule,
    LeaderboardModule,
    WaveModule,
    LotteryModule,
    EmailModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
