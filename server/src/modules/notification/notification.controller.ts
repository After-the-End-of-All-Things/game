import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { NotificationService } from '@modules/notification/notification.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@utils/user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/mine')
  async getMyNotifications(@User() user) {
    return {
      notifications: await this.notificationService.getNotificationsForUser(
        user.userId,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mine/after')
  async getMyNotificationsAfter(@User() user, @Query('after') after: string) {
    if (!after) return this.getMyNotifications(user);

    return {
      notifications:
        await this.notificationService.getNotificationsForUserAfter(
          user.userId,
          new Date(after),
        ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/markallread')
  async markAllRead(@User() user) {
    return this.notificationService.markAllNotificationsRead(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/markread')
  async markRead(@User() user, @Body('notificationId') notificationId: string) {
    return this.notificationService.markNotificationRead(notificationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/clearactions')
  async clearActions(
    @User() user,
    @Body('notificationId') notificationId: string,
  ) {
    return this.notificationService.clearNotificationActions(notificationId);
  }
}
