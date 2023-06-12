import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Achievements } from '@modules/achievements/achievements.schema';
import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

@Module({
  imports: [MikroOrmModule.forFeature([Achievements])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
