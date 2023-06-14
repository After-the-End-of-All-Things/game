import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { GameplayService } from '@modules/player/gameplay.service';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@utils/user.decorator';

@Controller('gameplay')
export class GameplayController {
  constructor(private gameplayService: GameplayService) {}

  @UseGuards(JwtAuthGuard)
  @Post('explore')
  async explore(@User() user) {
    return this.gameplayService.explore(user.userId);
  }
}
