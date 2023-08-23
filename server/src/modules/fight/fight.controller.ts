import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { FightService } from '@modules/fight/fight.service';
import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@Controller('fight')
export class FightController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly fightService: FightService,
  ) {}

  @Sse('/sse/:token')
  @ApiOperation({
    summary: 'Create an event stream for the client to subscribe to',
  })
  async notificationStream(@Param('token') token: string) {
    const data: any = this.jwtService.decode(token);
    if (!data) throw new BadRequestException('Invalid token');

    return this.fightService.subscribe(data.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/action/flee')
  @ApiOperation({
    summary: 'Flee from combat',
  })
  async flee(@User('token') user) {
    return this.fightService.flee(user.userId);
  }
}
