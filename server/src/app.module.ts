import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { FlushInterceptor } from 'src/utils/flush.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlayerModule } from './modules/player/player.module';
import { StatsModule } from './modules/stats/stats.module';
import { UserModule } from './modules/user/user.module';
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
  ],
  controllers: [AppController],
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
