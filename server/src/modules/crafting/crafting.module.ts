import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Crafting } from '@modules/crafting/crafting.schema';
import { Module } from '@nestjs/common';
import { CraftingService } from './crafting.service';

@Module({
  imports: [MikroOrmModule.forFeature([Crafting])],
  providers: [CraftingService],
  exports: [CraftingService],
})
export class CraftingModule {}
