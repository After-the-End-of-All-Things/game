import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
