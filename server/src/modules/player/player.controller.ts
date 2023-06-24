import { IFullUser, IPatchUser } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { PlayerService } from '@modules/player/player.service';
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { NotFoundException } from '@nestjs/common';

@ApiBearerAuth()
@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Portrait' })
  @Patch('cosmetics/portrait')
  async changePortrait(
    @User() user,
    @Body('portrait') portrait: number,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const portraitId = Math.round(Math.min(107, Math.max(0, portrait)));

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
