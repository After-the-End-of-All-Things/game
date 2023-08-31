import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { NotificationService } from '@modules/notification/notification.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all of my current notifications' })
  @Get('/mine')
  async getMyNotifications(@User() user) {
    return {
      notifications: await this.notificationService.getNotificationsForUser(
        user.userId,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark all of my notifications read' })
  @Post('/markallread')
  async markAllRead(@User() user) {
    return this.notificationService.markAllNotificationsRead(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a specific notification read' })
  @Post('/markread')
  async markRead(@User() user, @Body('notificationId') notificationId: string) {
    return this.notificationService.markNotificationRead(notificationId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Clear the actions from a notification' })
  @Post('/clearactions')
  async clearActions(
    @User() user,
    @Body('notificationId') notificationId: string,
  ) {
    return this.notificationService.clearNotificationActions(notificationId);
  }
}
