import { ConstantsService } from '@modules/content/constants.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsService } from './analytics.service';
import { ContentService } from './content.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ContentService,
    ConstantsService,
    AnalyticsService,
    PlayerHelperService,
  ],
  exports: [
    ContentService,
    ConstantsService,
    AnalyticsService,
    PlayerHelperService,
  ],
})
export class ContentModule {}
