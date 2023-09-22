import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AggregatorModule } from '@modules/aggregator/aggregator.module';
import { UserVerification } from '@modules/auth/verification.schema';
import { ConfigModule } from '@modules/config/config.module';
import { ContentModule } from '@modules/content/content.module';
import { EmailModule } from '@modules/email/email.module';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    AggregatorModule,
    ConfigModule,
    NestConfigModule,
    ContentModule,
    EmailModule,
    MikroOrmModule.forFeature([UserVerification]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
