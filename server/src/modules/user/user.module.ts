import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from '@modules/user/user.controller';
import { User } from '@modules/user/user.schema';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
