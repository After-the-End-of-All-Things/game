import { ConstantsService } from '@modules/content/constants.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsService } from './analytics.service';
import { ContentService } from './content.service';

@Module({
  imports: [ConfigModule],
  providers: [ContentService, ConstantsService, AnalyticsService],
  exports: [ContentService, ConstantsService, AnalyticsService],
})
export class ContentModule {}
