import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '../../utils/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('online')
  async onlineUsers() {
    return { users: await this.userService.onlineUsers() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getMyProfile(@User() user) {
    return { user: await this.userService.findUserById(user.userId) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return { user: await this.userService.findUserById(id) };
  }
}
