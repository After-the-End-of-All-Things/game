import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationController } from '@modules/notification/notification.controller';
import { Notification } from '@modules/notification/notification.schema';
import { NotificationService } from '@modules/notification/notification.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [NotificationController],
  imports: [MikroOrmModule.forFeature([Notification])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
