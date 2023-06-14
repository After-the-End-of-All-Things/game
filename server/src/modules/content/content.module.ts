import { ConstantsService } from '@modules/content/constants.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContentService } from './content.service';

@Module({
  imports: [ConfigModule],
  providers: [ContentService, ConstantsService],
  exports: [ContentService, ConstantsService],
})
export class ContentModule {}
