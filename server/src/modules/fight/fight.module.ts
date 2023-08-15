import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Fight } from '@modules/fight/fight.schema';
import { FightService } from '@modules/fight/fight.service';
import { Module } from '@nestjs/common';
import { FightController } from './fight.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Fight])],
  controllers: [FightController],
  providers: [FightService],
  exports: [FightService],
})
export class FightModule {}
