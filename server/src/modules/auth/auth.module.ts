import { ContentModule } from '@modules/content/content.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UserModule, ConfigModule, ContentModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
