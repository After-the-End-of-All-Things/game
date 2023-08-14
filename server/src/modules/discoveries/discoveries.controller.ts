import { IFullUser, IPatchUser } from '@interfaces';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { PlayerService } from '@modules/player/player.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '../../utils/user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@Controller('discoveries')
export class DiscoveriesController {
  constructor(
    private readonly discoveriesService: DiscoveriesService,
    private readonly playerService: PlayerService,
  ) {}

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
  @ApiOperation({ summary: 'Change Player Portrait' })
  @Patch('cosmetics/portrait')
  async changePortrait(
    @User() user,
    @Body('portrait') portrait: number,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const portraitId = Math.round(Math.min(106, Math.max(0, portrait)));

    // Fetch the player's discoveries
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      user.userId,
    );

    if (!discoveries) {
      throw new NotFoundException('Discoveries not found for this user.');
    }

    // Check if the portrait is unlocked
    if (!discoveries.portraits[portraitId.toString()]) {
      throw new NotFoundException(`Portrait ${portraitId} is not unlocked.`);
    }

    return this.playerService.updatePortraitForPlayer(user.userId, portraitId);
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Claim rewards for discovering unique collectibles',
  })
  @Post('claim/unique/collectible')
  async claimUniqueCollectible(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.discoveriesService.claimUniqueCollectibleReward(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim rewards for discovering collectibles' })
  @Post('claim/total/collectible')
  async claimTotalCollectible(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.discoveriesService.claimTotalCollectibleReward(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim rewards for discovering unique equipment' })
  @Post('claim/unique/equipment')
  async claimUniqueEquipment(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.discoveriesService.claimUniqueEquipmentReward(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim rewards for discovering equipment' })
  @Post('claim/total/equipment')
  async claimTotalEquipment(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.discoveriesService.claimTotalEquipmentReward(user.userId);
  }
}
