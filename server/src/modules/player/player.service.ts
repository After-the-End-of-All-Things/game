import {
  IFullUser,
  ILocation,
  INotificationAction,
  IPatchUser,
  Rarity,
} from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { Player } from '@modules/player/player.schema';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { sample } from 'lodash';

@Injectable()
export class PlayerService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Player)
    private readonly players: EntityRepository<Player>,
    private readonly contentService: ContentService,
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
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('player id already in use.');
      }
    }

    return player;
  }

  async updatePortraitForPlayer(
    userId: string,
    portrait: number,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const player = await this.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        playerRef.cosmetics = { ...player.cosmetics, portrait };
      },
    );

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
  ): Promise<Partial<IFullUser | IPatchUser>> {
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
  ): Promise<Partial<IFullUser | IPatchUser>> {
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

  async handleRandomWave(player: Player) {
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

  async handleFindResource(player: Player, location: ILocation): Promise<any> {
    const resourceRarityCommonality: Record<Rarity, number> = {
      Common: 100,
      Uncommon: 75,
      Unusual: 50,
      Rare: 25,
      Epic: 10,
      Arcane: 5,
      Divine: 3,
      Masterful: 2,
      Unique: 1,
    };

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
  ): Promise<any> {
    const collectibleRarityCommonality: Record<Rarity, number> = {
      Common: 100,
      Uncommon: 75,
      Unusual: 50,
      Rare: 25,
      Epic: 10,
      Arcane: 5,
      Divine: 3,
      Masterful: 2,
      Unique: 1,
    };

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

  async handleFindItem(player: Player, location: ILocation): Promise<any> {
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
}
