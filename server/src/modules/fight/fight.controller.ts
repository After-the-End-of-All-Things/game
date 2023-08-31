import { ICombatTargetParams } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { FightService } from '@modules/fight/fight.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@Controller('fight')
export class FightController {
  constructor(private readonly fightService: FightService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/action')
  @ApiOperation({
    summary: 'Do an action',
  })
  async takeAction(
    @User('token') user,
    @Body('actionId') actionId: string,
    @Body('targetParams') targetParams: ICombatTargetParams,
  ) {
    return this.fightService.takeAction(user.userId, actionId, targetParams);
  }
}
