import { ConstantsService } from '@modules/content/constants.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { omit } from 'lodash';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly constantsService: ConstantsService,
  ) {}

  @Get('api/game/stats')
  @ApiOperation({ summary: 'Get all game constant values' })
  getStats() {
    return omit(this.constantsService, ['configService']);
  }
}
