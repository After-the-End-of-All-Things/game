import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AchievementsModule } from '@modules/achievements/achievements.module';
import { CraftingModule } from '@modules/crafting/crafting.module';
import { DiscoveriesModule } from '@modules/discoveries/discoveries.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { PlayerModule } from '@modules/player/player.module';
import { StatsModule } from '@modules/stats/stats.module';
import { UserController } from '@modules/user/user.controller';
import { User } from '@modules/user/user.schema';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  imports: [
    MikroOrmModule.forFeature([User]),
    PlayerModule,
    StatsModule,
    AchievementsModule,
    DiscoveriesModule,
    InventoryModule,
    CraftingModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
