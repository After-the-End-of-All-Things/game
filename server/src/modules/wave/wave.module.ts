import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PlayerWave } from '@modules/wave/playerwave.schema';
import { Module } from '@nestjs/common';
import { WaveDBService } from './wavedb.service';

@Module({
  imports: [MikroOrmModule.forFeature([PlayerWave])],
  providers: [WaveDBService],
  exports: [WaveDBService],
})
export class WaveModule {}
