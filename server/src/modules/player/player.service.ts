import { zeroResistances, zeroStats } from '@helpers/stats';
import {
  Element,
  ILocation,
  INotificationAction,
  Rarity,
  Stat,
  UserResponse,
} from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Player } from '@modules/player/player.schema';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { sample } from 'lodash';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PlayerService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Player)
    private readonly players: EntityRepository<Player>,
    private readonly contentService: ContentService,
    private readonly constants: ConstantsService,
    private readonly inventoryService: InventoryService,
  ) {}

  async getPlayerForUser(userId: string): Promise<Player | undefined> {
    const dbPlayer = await this.players.findOne({ userId });
    if (!dbPlayer) {
      return await this.createPlayerForUser(userId);
    }

    return dbPlayer;
  }

  async createPlayerForUser(userId: string): Promise<Player | undefined> {
    const player = new Player(userId);

    try {
      await this.players.create(player);
      await this.em.flush();
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('player id already in use.');
      }

      throw e;
    }

    return player;
  }

  async updatePortraitForPlayer(
    userId: string,
    portrait: number,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.cosmetics = { ...player.cosmetics, portrait };
      },
    );

    this.logger.verbose(`Updated portrait for player ${userId} to ${portrait}`);

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `Portrait updated!`,
        },
      ],
    };
  }

  async updateShortBioForPlayer(
    userId: string,
    shortBio: string,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    shortBio = this.contentService.censor.cleanProfanityIsh(
      shortBio.substring(0, 30).trim(),
    );

    if (player.profile.shortBio === shortBio) return {};

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.profile = { ...playerRef.profile, shortBio };
      },
    );

    this.logger.verbose(
      `Updated short bio for player ${userId} to ${shortBio}`,
    );

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `Tagline updated!`,
        },
      ],
    };
  }

  async updateLongBioForPlayer(
    userId: string,
    longBio: string,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    longBio = this.contentService.censor.cleanProfanityIsh(
      longBio.substring(0, 500).trim(),
    );

    if (player.profile.longBio === longBio) return {};

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.profile = { ...playerRef.profile, longBio };
      },
    );

    this.logger.verbose(`Updated long bio for player ${userId} to ${longBio}`);

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `Bio updated!`,
        },
      ],
    };
  }

  getMicroPlayer(player: Player): Partial<Player> {
    return {
      userId: player.userId,
      level: player.level,
      job: player.job,
      cosmetics: {
        portrait: player.cosmetics.portrait,
        background: player.cosmetics.background,
      },
      profile: {
        displayName: player.profile.displayName,
        shortBio: player.profile.shortBio,
        longBio: '',
      },
    };
  }

  setPlayerAction(player: Player, action: INotificationAction | undefined) {
    player.action = action;

    if (!action) {
      return;
    }

    if (player.action?.actionData) {
      player.action.actionData = {
        ...player.action.actionData,
      };

      if (player.action.actionData.player) {
        player.action.actionData.player = this.getMicroPlayer(
          player.action.actionData.player,
        );
      }
    }
  }

  private getFindCommonality(): Record<Rarity, number> {
    return {
      Common: this.constants.findRateCommon,
      Uncommon: this.constants.findRateUncommon,
      Unusual: this.constants.findRateUnusual,
      Rare: this.constants.findRateRare,
      Epic: this.constants.findRateEpic,
      Masterful: this.constants.findRateMasterful,
      Arcane: this.constants.findRateArcane,
      Divine: this.constants.findRateDivine,
      Unique: this.constants.findRateUnique,
    };
  }

  async getRandomOnlinePlayerAtLocation(
    excludeUserId: string,
    locationName: string,
  ): Promise<Player> {
    const currentTime = Date.now();

    const found = await this.em.aggregate(Player, [
      {
        $lookup: {
          from: 'user',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: '$$userId' }, '$_id'],
                },
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $match: {
          'location.current': locationName,
          'user.onlineUntil': { $gt: currentTime },
          userId: { $ne: excludeUserId },
        },
      },
      {
        $sample: { size: 1 },
      },
    ]);

    return found[0];
  }

  async handleRandomWave(player: Player): Promise<void> {
    const randomPlayer = await this.getRandomOnlinePlayerAtLocation(
      player.userId,
      player.location.current,
    );

    if (!randomPlayer) return;

    this.setPlayerAction(player, {
      text: 'Wave',
      action: 'wave',
      actionData: {
        player: randomPlayer,
      },
      url: 'gameplay/wave',
      urlData: {
        targetUserId: randomPlayer.userId,
      },
    });
  }

  async handleFindResource(player: Player, location: ILocation): Promise<void> {
    const resourceRarityCommonality = this.getFindCommonality();

    const allResources = this.contentService
      .allResources()
      .filter((res) => res.location === location.name);

    const allResourcesWithRarity = allResources
      .map((res) => Array(resourceRarityCommonality[res.rarity] ?? 1).fill(res))
      .flat();

    const randomResourceForLocation = sample(allResourcesWithRarity);
    if (!randomResourceForLocation) return;

    this.setPlayerAction(player, {
      text: 'Take',
      action: 'resource',
      actionData: {
        item: randomResourceForLocation,
      },
      url: 'gameplay/item/take',
      urlData: {},
    });
  }

  async handleFindCollectible(
    player: Player,
    location: ILocation,
  ): Promise<void> {
    const collectibleRarityCommonality = this.getFindCommonality();

    const allCollectibles = this.contentService
      .allCollectibles()
      .filter((coll) => coll.location === location.name);

    const allCollectiblesWithRarity = allCollectibles
      .map((coll) =>
        Array(collectibleRarityCommonality[coll.rarity] ?? 1).fill(coll),
      )
      .flat();

    const randomCollectibleForLocation = sample(allCollectiblesWithRarity);
    if (!randomCollectibleForLocation) return;

    this.setPlayerAction(player, {
      text: 'Take',
      action: 'collectible',
      actionData: {
        item: randomCollectibleForLocation,
      },
      url: 'gameplay/item/take',
      urlData: {},
    });
  }

  async handleFindItem(player: Player, location: ILocation): Promise<void> {
    const randomItemForLocation = sample(
      this.contentService
        .allEquipment()
        .filter(
          (item) =>
            !this.contentService.getRecipe(item.itemId) &&
            item.levelRequirement <= location.level &&
            item.levelRequirement >= location.itemLevel,
        ),
    );

    if (!randomItemForLocation) return;

    this.setPlayerAction(player, {
      text: 'Take',
      action: 'item',
      actionData: {
        item: randomItemForLocation,
      },
      url: 'gameplay/item/take',
      urlData: {},
    });
  }

  async handleFindMonster(player: Player, location: ILocation): Promise<void> {
    const randomFormationForLocation = sample(
      this.contentService
        .allFormations()
        .filter((formation) => formation.location === location.name),
    );

    if (!randomFormationForLocation) return;

    this.setPlayerAction(player, {
      text: 'Fight',
      action: 'fight',
      actionData: {
        formation: randomFormationForLocation,
        stopExplore: true,
      },
      url: 'gameplay/fight',
      urlData: {},
    });
  }

  async getTotalStats(player: Player): Promise<Record<Stat, number>> {
    const base = zeroStats();

    // get job stats
    const job = this.contentService.getJob(player.job);
    if (!job) return base;

    Object.keys(job.statGainsPerLevel).forEach((stat) => {
      base[stat as Stat] += job.statGainsPerLevel[stat as Stat] * player.level;
    });

    // get equipment stats
    const equipment = await this.inventoryService.getEquipmentFor(
      player.userId,
    );

    Object.values(equipment)
      .filter(Boolean)
      .forEach((item) => {
        if (!item) return;

        Object.entries(item.stats).forEach(([stat, value]) => {
          base[stat as Stat] += value;
        });
      });

    return base;
  }

  async getTotalResistances(player: Player): Promise<Record<Element, number>> {
    const base = zeroResistances();
    const equipment = await this.inventoryService.getEquipmentFor(
      player.userId,
    );

    Object.values(equipment)
      .filter(Boolean)
      .forEach((item) => {
        if (!item) return;

        // 10% resistance per element in defense elements
        (item.defenseElements || []).forEach((element) => {
          base[element] -= 0.1;
        });
      });

    return base;
  }
}
