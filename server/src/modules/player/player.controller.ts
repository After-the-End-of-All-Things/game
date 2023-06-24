import { IFullUser, IPatchUser } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { PlayerService } from '@modules/player/player.service';
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the online users count' })
  @Patch('cosmetics/portrait')
  async changePortrait(
    @User() user,
    @Body('portrait') portrait: number,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const portraitId = Math.round(Math.min(107, Math.max(0, portrait)));

    return this.playerService.updatePortraitForPlayer(user.userId, portraitId);
  }
}
