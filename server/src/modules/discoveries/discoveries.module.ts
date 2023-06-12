import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Module } from '@nestjs/common';
import { DiscoveriesController } from './discoveries.controller';
import { DiscoveriesService } from './discoveries.service';

@Module({
  imports: [MikroOrmModule.forFeature([Discoveries])],
  controllers: [DiscoveriesController],
  providers: [DiscoveriesService],
  exports: [DiscoveriesService],
})
export class DiscoveriesModule {}
