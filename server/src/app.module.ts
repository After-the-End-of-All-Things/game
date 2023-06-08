import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
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

@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule,
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
  ],
})
export class AppModule {}
