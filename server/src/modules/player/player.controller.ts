import { UserResponse } from '@interfaces';
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
}
