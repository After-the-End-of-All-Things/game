import { UserResponse } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { PlayerService } from '@modules/player/player.service';
import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('player')
export class PlayerController {
  constructor(
    private readonly discoveriesService: DiscoveriesService,
    private readonly playerService: PlayerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Tagline' })
  @Patch('profile/shortbio')
  async changeShortBio(
    @User() user,
    @Body('shortbio') shortbio: string,
  ): Promise<UserResponse> {
    return this.playerService.updateShortBioForPlayer(user.userId, shortbio);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Bio' })
  @Patch('profile/longbio')
  async changeLongBio(
    @User() user,
    @Body('longbio') longbio: string,
  ): Promise<UserResponse> {
    return this.playerService.updateLongBioForPlayer(user.userId, longbio);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Portrait' })
  @Patch('cosmetics/portrait')
  async changePortrait(
    @User() user,
    @Body('portrait') portrait: number,
  ): Promise<UserResponse> {
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
}
