import { IFullUser } from '@interfaces';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { CraftingService } from '@modules/crafting/crafting.service';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { FightService } from '@modules/fight/fight.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AggregatorService {
  constructor(
    private readonly userService: UserService,
    private readonly playerService: PlayerService,
    private readonly statsService: StatsService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly achievementsService: AchievementsService,
    private readonly inventoryService: InventoryService,
    private readonly craftingService: CraftingService,
    private readonly fightService: FightService,
  ) {}

  async getAllUserInformation(userId: string): Promise<IFullUser> {
    const user = await this.userService.findUserById(userId);
    const player = await this.playerService.getPlayerForUser(userId);
    const stats = await this.statsService.getStatsForUser(userId);
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );
    const achievements = await this.achievementsService.getAchievementsForUser(
      userId,
    );
    const inventory = await this.inventoryService.getInventoryForUser(userId);
    const crafting = await this.craftingService.getCraftingForUser(userId);
    const fight = await this.fightService.getFightForUser(userId);

    const fullUser: IFullUser = {
      user,
      player,
      stats,
      discoveries,
      achievements,
      inventory,
      crafting,
      fight,
    } as IFullUser;

    await this.migrateAccount(fullUser);

    return fullUser;
  }

  async migrateAccount(user: IFullUser): Promise<void> {
    if (!user.player.profile.displayName) {
      user.player.profile = {
        ...user.player.profile,
        displayName: user.user.username,
      };
    }
  }
}
