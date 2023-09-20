import { TrackedStat, UserResponse } from '@interfaces';
import { EntityManager } from '@mikro-orm/mongodb';
import { AnalyticsService } from '@modules/content/analytics.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userError } from '@utils/usernotifications';

@Injectable()
export class NpcService {
  constructor(
    private readonly em: EntityManager,
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly inventoryService: InventoryService,
    private readonly statsService: StatsService,
    private readonly analyticsService: AnalyticsService,
    private readonly playerHelper: PlayerHelperService,
  ) {}

  async changeClass(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const inventory = await this.inventoryService.getInventoryForUser(
      player.userId,
    );
    if (!inventory)
      throw new NotFoundException(`Inventory ${userId} not found`);

    const newJob = player.action?.actionData.newJob;
    if (!newJob) throw new NotFoundException(`New job ${newJob} not found.`);

    const currentJob = player.job;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerService.changeJob(player, currentJob, newJob);

        this.playerService.setPlayerAction(playerRef, undefined);

        this.analyticsService.sendDesignEvent(
          userId,
          `Gameplay:ChangeClass:${newJob}`,
        );

        await this.statsService.incrementStat(
          userId,
          'classChanges' as TrackedStat,
          1,
        );
      },
    );

    const inventoryPatches = await getPatchesAfterPropChanges<Inventory>(
      inventory,
      async (inventoryRef) => {
        this.playerService.changeJobEquipment(inventoryRef, currentJob, newJob);
      },
    );

    return {
      player: playerPatches,
      inventory: inventoryPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You changed your job to ${newJob}!`,
        },
      ],
    };
  }

  async buyPortrait(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const { unlockSprite, unlockCost } =
      player.action?.actionData.npc.properties;

    if (!this.playerHelper.hasCoins(player, unlockCost ?? 0))
      return userError('Not enough coins.');

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );
    if (!discoveries)
      throw new NotFoundException(`Discoveries ${userId} not found.`);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.spendCoins(playerRef, unlockCost ?? 0);
        this.playerService.setPlayerAction(playerRef, undefined);
      },
    );

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        this.discoveriesService.discoverPortrait(discoveriesRef, unlockSprite);
      },
    );

    await this.em.flush();

    return {
      player: playerPatches,
      discoveries: discoveryPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You unlocked a new portrait!`,
        },
      ],
    };
  }

  async buyBackground(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const { unlockBackground, unlockCost } =
      player.action?.actionData.npc.properties;

    if (!this.playerHelper.hasCoins(player, unlockCost ?? 0))
      return userError('Not enough coins.');

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );
    if (!discoveries)
      throw new NotFoundException(`Discoveries ${userId} not found.`);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.spendCoins(playerRef, unlockCost ?? 0);
        this.playerService.setPlayerAction(playerRef, undefined);
      },
    );

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        this.discoveriesService.discoverBackground(
          discoveriesRef,
          unlockBackground,
        );
      },
    );

    await this.em.flush();

    return {
      player: playerPatches,
      discoveries: discoveryPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You unlocked a new background!`,
        },
      ],
    };
  }
}
