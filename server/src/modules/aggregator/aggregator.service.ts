import { IEquipment, IFullUser, ItemSlot } from '@interfaces';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { ContentService } from '@modules/content/content.service';
import { CraftingService } from '@modules/crafting/crafting.service';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { FightService } from '@modules/fight/fight.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AggregatorService {
  constructor(
    private readonly logger: Logger,
    private readonly contentService: ContentService,
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
    const fight = await this.fightService.getValidFightForUser(userId);

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

    const equippedItems = user.inventory.equippedItems;
    await Promise.all(
      Object.keys(equippedItems).map(async (slot: ItemSlot) => {
        const currentEquippedItem = equippedItems[slot];
        if (!currentEquippedItem) return;

        const checkItem = this.contentService.getItem(
          currentEquippedItem.itemId,
        ) as IEquipment;
        if (!checkItem) return;

        const currentItem = JSON.stringify(
          omit(currentEquippedItem, ['instanceId']),
        );
        const newItem = JSON.stringify(checkItem);

        if (currentItem && newItem && currentItem !== newItem) {
          console.log({ currentItem, newItem });
          this.logger.verbose(
            `Migrating item ${currentEquippedItem.name} for ${user.user.username}.`,
          );
          await this.inventoryService.updateEquippedItem(user.user.id, slot, {
            ...checkItem,
            instanceId: currentEquippedItem.instanceId,
          });
        }
      }),
    );
  }
}
