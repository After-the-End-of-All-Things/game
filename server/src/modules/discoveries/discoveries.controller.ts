import { IFullUser, IPatchUser } from '@interfaces';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RollbarHandler } from 'nestjs-rollbar';
import { User } from '../../utils/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@Controller('discoveries')
export class DiscoveriesController {
  constructor(private readonly discoveriesService: DiscoveriesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my discoveries' })
  @Get('mine')
  @RollbarHandler()
  async getMyDiscoveries(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      user.userId,
    );
    if (!discoveries) throw new NotFoundException('User not found');

    return { discoveries };
  }
}
