import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RollbarHandler } from 'nestjs-rollbar';
import { User } from '../../utils/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('online')
  @RollbarHandler()
  @ApiOperation({ summary: 'Get the online users count' })
  async onlineUsers() {
    return { users: await this.userService.onlineUsers() };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my user profile' })
  @Get('profile/me')
  @RollbarHandler()
  async getMyProfile(@User() user) {
    return { user: await this.userService.findUserById(user.userId) };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific user profile' })
  @Get('profile/:id')
  @RollbarHandler()
  async getProfile(@Param('id') id: string) {
    return { user: await this.userService.findUserById(id) };
  }
}
