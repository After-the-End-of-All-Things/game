import { ILocation, UserResponse } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { sample, sum } from 'lodash';
import { Logger } from 'nestjs-pino';

@Injectable()
export class DiscoveriesService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Discoveries)
    private readonly discoveries: EntityRepository<Discoveries>,
    private readonly inventoryService: InventoryService,
    private readonly contentService: ContentService,
    private readonly constants: ConstantsService,
    private readonly events: EventEmitter2,
    private readonly playerService: PlayerService,
    private readonly playerHelper: PlayerHelperService,
  ) {}

  async getDiscoveriesForUser(
    userId: string,
  ): Promise<Discoveries | undefined> {
    const dbDiscoveries = await this.discoveries.findOne({ userId });
    if (!dbDiscoveries) {
      return await this.createDiscoveriesForUser(userId);
    }

    return dbDiscoveries;
  }

  async createDiscoveriesForUser(
    userId: string,
  ): Promise<Discoveries | undefined> {
    const discoveries = new Discoveries(userId);

    try {
      await this.discoveries.create(discoveries);
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('discoveries id already in use.');
      }

      throw e;
    } finally {
      await this.em.flush();
    }

    return discoveries;
  }

  async handleExploreDiscoveries(
    player: Player,
    discoveries: Discoveries,
    location: ILocation,
  ) {
    const locations = location.connections;
    if (locations.length > 0) {
      const discoveredLocation = sample(locations);
      if (!discoveredLocation) return;

      const didDiscover = this.discoverLocation(
        discoveries,
        discoveredLocation.name,
      );

      if (didDiscover) {
        this.events.emit('notification.create', {
          userId: player.userId,
          notification: {
            liveAt: new Date(),
            text: `You have discovered ${discoveredLocation.name}!`,
            actions: [
              {
                text: 'Travel',
                action: 'navigate',
                actionData: { url: '/travel' },
              },
            ],
          },
          expiresAfterHours: 1,
        });
      }
    }
  }

  discoverLocation(discoveries: Discoveries, locationName: string): boolean {
    if (discoveries.locations[locationName]) return false;

    this.logger.verbose(
      `Discovered ${locationName} for ${discoveries.userId}.`,
    );
    discoveries.locations = { ...discoveries.locations, [locationName]: true };
    return true;
  }

  async discoverCollectible(
    userId: string,
    instanceId: string,
  ): Promise<UserResponse> {
    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('User not found');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new NotFoundException('Collectible item not found');

    const itemDefinition = await this.contentService.getCollectible(
      item.itemId,
    );
    if (!itemDefinition)
      throw new NotFoundException('Item definition not found');

    await this.inventoryService.removeInventoryItemForUser(userId, instanceId);

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.collectibles = {
          ...(discoveriesRef.collectibles || {}),
          [itemDefinition.itemId]:
            (discoveriesRef.collectibles?.[itemDefinition.itemId] ?? 0) + 1,
        };
      },
    );

    this.logger.verbose(
      `Discovered collectible ${itemDefinition.name} for ${userId}.`,
    );

    return {
      discoveries: discoveryPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You collected ${itemDefinition.name}!`,
        },
        {
          type: 'RemoveInventoryItem',
          instanceId,
        },
      ],
    };
  }

  async discoverEquipment(
    userId: string,
    instanceId: string,
  ): Promise<UserResponse> {
    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('User not found');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new NotFoundException('Equipment item not found');

    const itemDefinition = await this.contentService.getEquipment(item.itemId);
    if (!itemDefinition) {
      await this.inventoryService.removeInventoryItemForUser(
        userId,
        instanceId,
      );
      throw new NotFoundException('Item definition not found');
    }

    await this.inventoryService.removeInventoryItemForUser(userId, instanceId);

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.items = {
          ...(discoveriesRef.items || {}),
          [itemDefinition.itemId]:
            (discoveriesRef.items?.[itemDefinition.itemId] ?? 0) + 1,
        };
      },
    );

    this.logger.verbose(
      `Discovered equipment ${itemDefinition.name} for ${userId}.`,
    );

    return {
      discoveries: discoveryPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You collected ${itemDefinition.name}!`,
        },
        {
          type: 'RemoveInventoryItem',
          instanceId,
        },
      ],
    };
  }

  async discoverMonster(userId: string, monsterId: string): Promise<void> {
    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('User not found');

    const monster = await this.contentService.getMonster(monsterId);
    if (!monster) throw new NotFoundException('Monster not found');

    this.logger.verbose(`Discovered monster ${monster.name} for ${userId}.`);

    discoveries.monsters = {
      ...(discoveries.monsters || {}),
      [monsterId]: (discoveries.monsters?.[monsterId] ?? 0) + 1,
    };
  }

  async claimUniqueCollectibleReward(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('Discoveries not found');

    const totalTimesClaimed = discoveries.uniqueCollectibleClaims ?? 0;
    const totalCollectiblesFound = sum(Object.keys(discoveries.collectibles));
    const interval = this.constants.uniqueCollectiblesRequired;

    if (totalCollectiblesFound < (totalTimesClaimed + 1) * interval)
      throw new BadRequestException('Not enough collectibles found');

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.uniqueCollectibleClaims = totalTimesClaimed + 1;
      },
    );

    const coinReward = this.constants.uniqueCollectibleRewardMultiplier * 1000;
    const oatReward = this.constants.uniqueCollectibleRewardMultiplier;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
      },
    );

    this.logger.verbose(
      `Claimed unique collectible reward for ${userId} (${totalCollectiblesFound} total).`,
    );

    return {
      discoveries: discoveryPatches,
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You got ${coinReward.toLocaleString()} coins and ${oatReward.toLocaleString()} oats!`,
        },
      ],
    };
  }

  async claimTotalCollectibleReward(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('Discoveries not found');

    const totalTimesClaimed = discoveries.totalCollectibleClaims ?? 0;
    const totalCollectiblesFound = sum(Object.values(discoveries.collectibles));
    const interval = this.constants.totalCollectiblesRequired;

    if (totalCollectiblesFound < (totalTimesClaimed + 1) * interval)
      throw new BadRequestException('Not enough collectibles found');

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.totalCollectibleClaims = totalTimesClaimed + 1;
      },
    );

    const coinReward = this.constants.totalCollectibleRewardMultiplier * 1000;
    const oatReward = this.constants.totalCollectibleRewardMultiplier;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
      },
    );

    this.logger.verbose(
      `Claimed total collectible reward for ${userId} (${totalCollectiblesFound} total).`,
    );

    return {
      discoveries: discoveryPatches,
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You got ${coinReward.toLocaleString()} coins and ${oatReward.toLocaleString()} oats!`,
        },
      ],
    };
  }

  async claimUniqueEquipmentReward(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('Discoveries not found');

    const totalTimesClaimed = discoveries.uniqueEquipmentClaims ?? 0;
    const totalItemsFound = sum(Object.keys(discoveries.items));
    const interval = this.constants.uniqueEquipmentRequired;

    if (totalItemsFound < (totalTimesClaimed + 1) * interval)
      throw new BadRequestException('Not enough equipment found');

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.uniqueEquipmentClaims = totalTimesClaimed + 1;
      },
    );

    const coinReward = this.constants.uniqueEquipmentRewardMultiplier * 1000;
    const oatReward = this.constants.uniqueEquipmentRewardMultiplier;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
      },
    );

    this.logger.verbose(
      `Claimed unique equipment reward for ${userId} (${totalItemsFound} total).`,
    );

    return {
      discoveries: discoveryPatches,
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You got ${coinReward.toLocaleString()} coins and ${oatReward.toLocaleString()} oats!`,
        },
      ],
    };
  }

  async claimTotalEquipmentReward(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('Discoveries not found');

    const totalTimesClaimed = discoveries.totalEquipmentClaims ?? 0;
    const totalItemsFound = sum(Object.values(discoveries.items));
    const interval = this.constants.totalEquipmentRequired;

    if (totalItemsFound < (totalTimesClaimed + 1) * interval)
      throw new ForbiddenException('Not enough equipment found');

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.totalEquipmentClaims = totalTimesClaimed + 1;
      },
    );

    const coinReward = this.constants.totalEquipmentRewardMultiplier * 1000;
    const oatReward = this.constants.totalEquipmentRewardMultiplier;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
      },
    );

    this.logger.verbose(
      `Claimed total equipment reward for ${userId} (${totalItemsFound} total).`,
    );

    return {
      discoveries: discoveryPatches,
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You got ${coinReward.toLocaleString()} coins and ${oatReward.toLocaleString()} oats!`,
        },
      ],
    };
  }

  async claimUniqueMonsterReward(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('Discoveries not found');

    const totalTimesClaimed = discoveries.uniqueMonsterClaims ?? 0;
    const totalItemsFound = sum(Object.keys(discoveries.monsters));
    const interval = this.constants.uniqueMonstersRequired;

    if (totalItemsFound < (totalTimesClaimed + 1) * interval)
      throw new BadRequestException('Not enough equipment found');

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.uniqueMonsterClaims = totalTimesClaimed + 1;
      },
    );

    const coinReward = this.constants.uniqueMonsterRewardMultiplier * 1000;
    const oatReward = this.constants.uniqueMonsterRewardMultiplier;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
      },
    );

    this.logger.verbose(
      `Claimed unique monster reward for ${userId} (${totalItemsFound} total).`,
    );

    return {
      discoveries: discoveryPatches,
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You got ${coinReward.toLocaleString()} coins and ${oatReward.toLocaleString()} oats!`,
        },
      ],
    };
  }

  async claimTotalMonsterReward(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('Discoveries not found');

    const totalTimesClaimed = discoveries.totalMonsterClaims ?? 0;
    const totalItemsFound = sum(Object.values(discoveries.monsters));
    const interval = this.constants.totalMonstersRequired;

    if (totalItemsFound < (totalTimesClaimed + 1) * interval)
      throw new ForbiddenException('Not enough equipment found');

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.totalMonsterClaims = totalTimesClaimed + 1;
      },
    );

    const coinReward = this.constants.totalMonsterRewardMultiplier * 1000;
    const oatReward = this.constants.totalMonsterRewardMultiplier;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
      },
    );

    this.logger.verbose(
      `Claimed total monster reward for ${userId} (${totalItemsFound} total).`,
    );

    return {
      discoveries: discoveryPatches,
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You got ${coinReward.toLocaleString()} coins and ${oatReward.toLocaleString()} oats!`,
        },
      ],
    };
  }
}
