import { IFullUser, IPatchUser } from '@interfaces';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '../../utils/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@Controller('discoveries')
export class DiscoveriesController {
  constructor(private readonly discoveriesService: DiscoveriesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my discoveries' })
  @Get('mine')
  async getMyDiscoveries(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      user.userId,
    );
    if (!discoveries) throw new NotFoundException('User not found');

    return { discoveries };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Discover a collectible' })
  @Post('discover/collectible')
  async discoverCollectible(
    @User() user,
    @Body('instanceId') instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.discoveriesService.discoverCollectible(user.userId, instanceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Discover an equipment item' })
  @Post('discover/equipment')
  async discoverEquipment(
    @User() user,
    @Body('instanceId') instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.discoveriesService.discoverEquipment(user.userId, instanceId);
  }
}
