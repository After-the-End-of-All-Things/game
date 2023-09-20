import { UserResponse } from '@interfaces';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '../../utils/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('online')
  @ApiOperation({ summary: 'Get the online users count' })
  async onlineUsers() {
    return { users: await this.userService.onlineUsers() };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my user profile' })
  @Get('profile/mine')
  async getMyProfile(@User() user): Promise<UserResponse> {
    const userRef = await this.userService.findUserById(user.userId);
    if (!userRef) throw new NotFoundException(`User ${user.userId} not found`);

    return { user: userRef };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific user profile' })
  @Get('profile/:id')
  async getProfile(@Param('id') id: string): Promise<UserResponse> {
    const userRef = await this.userService.findUserById(id);
    if (!userRef) throw new NotFoundException(`User ${id} not found`);

    return { user: userRef };
  }
}
