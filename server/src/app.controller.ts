import { ConstantsService } from '@modules/content/constants.service';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Sse,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation } from '@nestjs/swagger';
import { omit } from 'lodash';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly constantsService: ConstantsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('game/stats')
  @ApiOperation({ summary: 'Get all game constant values' })
  getStats() {
    return omit(this.constantsService, ['configService']);
  }

  @Sse('/sse/:token')
  @ApiOperation({
    summary: 'Create an event stream for the client to subscribe to',
  })
  async notificationStream(@Param('token') token: string) {
    const data: any = this.jwtService.decode(token);
    if (!data) throw new BadRequestException('Invalid token');

    return this.appService.subscribe(data.sub);
  }
}
