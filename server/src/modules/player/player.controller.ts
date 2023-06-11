import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { PlayerService } from '@modules/player/player.service';
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { User } from '@utils/user.decorator';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('cosmetics/portrait')
  async changePortrait(@User() user, @Body('portrait') portrait: number) {
    const portraitId = Math.round(Math.min(107, Math.max(0, portrait)));

    return {
      player: await this.playerService.updatePortraitForPlayer(
        user.userId,
        portraitId,
      ),
    };
  }
}
