import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StatsController } from '@modules/stats/stats.controller';
import { Stats } from '@modules/stats/stats.schema';
import { StatsService } from '@modules/stats/stats.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [StatsController],
  imports: [MikroOrmModule.forFeature([Stats])],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
