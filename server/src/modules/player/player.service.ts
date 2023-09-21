import { cleanNumber } from '@helpers/input';
import { zeroResistances, zeroStats } from '@helpers/stats';
import {
  Element,
  ILocation,
  IMonsterFormation,
  INotificationAction,
  Rarity,
  Stat,
  UserResponse,
} from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Inventory } from '@modules/inventory/inventory.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { NpcService } from '@modules/player/npc.service';
import { Player } from '@modules/player/player.schema';
import { WaveDBService } from '@modules/wave/wavedb.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { percentNumberAsMultiplier } from '@utils/number';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userError, userSuccessObject } from '@utils/usernotifications';
import { pickWeighted } from '@utils/weighted';
import { pick, sample } from 'lodash';
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
    private readonly discoveriesService: DiscoveriesService,
    private readonly npcService: NpcService,
    private readonly events: EventEmitter2,
    private readonly waveDBService: WaveDBService,
    private readonly playerHelper: PlayerHelperService,
  ) {}

  async getPlayerForUser(userId: string): Promise<Player> {
    const player = await this.getOrCreatePlayerForUser(userId);
    if (!player) {
      throw new BadRequestException(`player id ${userId} not found.`);
    }

    return player;
  }

  private async getOrCreatePlayerForUser(
    userId: string,
  ): Promise<Player | undefined> {
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
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException(`player id ${userId} already in use.`);
      }

      throw e;
    } finally {
      await this.em.flush();
    }

    return player;
  }

  async getPlayerProfile(userId: string): Promise<Partial<Player> | undefined> {
    const player = await this.getPlayerForUser(userId);

    return pick(player, [
      'userId',
      'level',
      'job',
      'location',
      'profile',
      'cosmetics',
      'otherJobLevels',
    ]);
  }

  async updatePortraitForPlayer(
    userId: string,
    portrait: number,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.cosmetics = { ...player.cosmetics, portrait };
      },
    );

    this.logger.verbose(`Updated portrait for player ${userId} to ${portrait}`);

    this.events.emit('sync.player', player);

    return {
      player: playerPatches,
      actions: [userSuccessObject(`Portrait updated!`)],
    };
  }

  async updateBackgroundForPlayer(
    userId: string,
    background: number,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.cosmetics = { ...player.cosmetics, background };
      },
    );

    this.logger.verbose(
      `Updated background for player ${userId} to ${background}`,
    );

    return {
      player: playerPatches,
      actions: [userSuccessObject(`Background updated!`)],
    };
  }

  async updateShortBioForPlayer(
    userId: string,
    shortBio: string,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);

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
      actions: [userSuccessObject(`Tagline updated!`)],
    };
  }

  async updateLongBioForPlayer(
    userId: string,
    longBio: string,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);

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
      actions: [userSuccessObject(`Bio updated!`)],
    };
  }

  async updateShowcaseCollectibles(
    userId: string,
    itemId: string,
    slot: number,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    if (itemId && !discoveries.collectibles[itemId])
      return userError('You have not discovered this collectible!');

    const validSlot = cleanNumber(slot, 0, {
      round: true,
      abs: true,
      min: 0,
    });

    if (validSlot >= this.constants.showcaseCollectibleSlots)
      return userError(
        'You do not have enough space in your showcase for that. Try removing something first.',
      );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        const baseShowcase = player.cosmetics.showcase || {};
        const baseCollectibles = baseShowcase.collectibles || [];

        baseCollectibles[validSlot] = itemId;

        const newCollectibles = baseCollectibles.filter(Boolean);

        playerRef.cosmetics = {
          ...playerRef.cosmetics,
          showcase: {
            ...baseShowcase,
            collectibles: newCollectibles,
          },
        };
      },
    );

    return {
      player: playerPatches,
      actions: [userSuccessObject('Collectible added to showcase!')],
    };
  }

  async updateShowcaseItems(
    userId: string,
    itemId: string,
    slot: number,
  ): Promise<UserResponse> {
    const player = await this.getPlayerForUser(userId);

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    if (itemId && !discoveries.items[itemId])
      return userError('You have not discovered this item!');

    const validSlot = cleanNumber(slot, 0, {
      round: true,
      abs: true,
      min: 0,
    });

    if (validSlot >= this.constants.showcaseItemSlots)
      return userError(
        'You do not have enough space in your showcase for that. Try removing something first.',
      );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        const baseShowcase = player.cosmetics.showcase || {};
        const baseItems = baseShowcase.items || [];

        baseItems[validSlot] = itemId;

        const newItems = baseItems.filter(Boolean);

        playerRef.cosmetics = {
          ...playerRef.cosmetics,
          showcase: {
            ...baseShowcase,
            items: newItems,
          },
        };
      },
    );

    return {
      player: playerPatches,
      actions: [userSuccessObject('Item added to showcase!')],
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
        showcase: player.cosmetics.showcase,
      },
      profile: {
        displayName: player.profile.displayName,
        discriminator: player.profile.discriminator,
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

    const existingWave = await this.waveDBService.getExistingWave(
      player.userId,
      randomPlayer.userId,
    );
    if (existingWave) return;

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
            !this.contentService.hasRecipe(item.itemId) &&
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
    const randomFormationForLocation = pickWeighted<IMonsterFormation>(
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

    if (this.playerHelper.isDeityDefenseBuffActive(player)) {
      base.toughness += base.toughness * percentNumberAsMultiplier(
        this.constants.worshipDefenseBoost,
        0,
      );
      base.resistance += base.resistance * percentNumberAsMultiplier(
        this.constants.worshipDefenseBoost,
        0,
      );
    }

    if (this.playerHelper.isDeityOffenseBuffActive(player)) {
      base.power += base.power * percentNumberAsMultiplier(
        this.constants.worshipOffenseBoost,
        0,
      );
      base.magic += base.magic * percentNumberAsMultiplier(
        this.constants.worshipOffenseBoost,
        0,
      );
    }

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

  async handleFindNPC(player: Player, location: ILocation): Promise<void> {
    const randomNPCForLocation = sample(location.npcs);
    if (!randomNPCForLocation) return;

    const npcData = this.contentService.getNPC(randomNPCForLocation.name);

    const action = await this.npcService.getActionForNPC(
      player,
      location,
      npcData,
    );
    if (!action) return;

    this.setPlayerAction(player, action);
  }

  changeJob(player: Player, currentJob: string, newJob: string) {
    player.otherJobLevels = {
      ...(player.otherJobLevels || {}),
      [currentJob]: player.level,
    };

    player.otherJobXp = {
      ...(player.otherJobXp || {}),
      [currentJob]: player.xp,
    };

    const newJobLevel = player.otherJobLevels?.[newJob] ?? 1;
    const newJobXp = player.otherJobXp?.[newJob] ?? 0;

    player.job = newJob;
    player.level = newJobLevel;
    player.xp = newJobXp;

    delete player.otherJobLevels?.[newJob];
    delete player.otherJobXp?.[newJob];

    this.events.emit('sync.player', player);
  }

  changeJobEquipment(inventory: Inventory, currentJob: string, newJob: string) {
    const newJobEquipment = inventory.otherJobEquipment?.[newJob] || {};
    inventory.otherJobEquipment = {
      ...(inventory.otherJobEquipment || {}),
      [currentJob]: inventory.equippedItems,
    };

    inventory.equippedItems = newJobEquipment;

    delete inventory.otherJobEquipment?.[newJob];
  }
}
