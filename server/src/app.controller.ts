import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { startOfToday } from '@utils/date';
import { omit } from 'lodash';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly content: ContentService,
    private readonly constantsService: ConstantsService,
  ) {}

  @Get('game/content')
  @ApiOperation({ summary: 'Get the game content' })
  getContent() {
    return this.content.content;
  }

  @Get('game/content/version')
  @ApiOperation({ summary: 'Get the game content version' })
  getContentVersion() {
    return this.content.content.meta;
  }

  @Get('game/stats')
  @ApiOperation({ summary: 'Get all game constant values' })
  getStats() {
    return omit(this.constantsService, ['configService']);
  }

  @Get('game/dailyreset')
  @ApiOperation({ summary: 'Get the time of daily reset' })
  getDailyReset() {
    return `"${startOfToday().toString()}"`;
  }
}
