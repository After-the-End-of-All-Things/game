import { xpForLevel } from '@helpers/xp';
import { Currency, ILocation, INotificationAction } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { NotificationService } from '@modules/notification/notification.service';
import { Player } from '@modules/player/player.schema';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import * as jsonpatch from 'fast-json-patch';
import { sample } from 'lodash';

@Injectable()
export class PlayerService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Player)
    private readonly players: EntityRepository<Player>,
    private readonly discoveriesService: DiscoveriesService,
    private readonly notificationService: NotificationService,
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
  ): Promise<jsonpatch.Operation[]> {
    const player = await this.getPlayerForUser(userId);
    if (!player) throw new ForbiddenException('Player not found');

    return getPatchesAfterPropChanges<Player>(player, async (playerRef) => {
      playerRef.cosmetics = { ...player.cosmetics, portrait };
    });
  }

  gainXp(player: Player, xp = 1) {
    player.xp += xp;
    this.attemptLevelUpForPlayer(player);
  }

  gainCurrency(player: Player, amount = 1, currency: Currency) {
    const newCurrencyValue = Math.max(
      0,
      (player.currencies[currency] ?? 0) + amount,
    );
    player.currencies = { ...player.currencies, [currency]: newCurrencyValue };
  }

  gainCoins(player: Player, amount = 1) {
    this.gainCurrency(player, amount, 'coins' as Currency);
  }

  spendCurrency(player: Player, amount = 1, currency: Currency) {
    this.gainCurrency(player, -amount, currency);
  }

  spendCoins(player: Player, amount = 1) {
    this.spendCurrency(player, amount, 'coins' as Currency);
  }

  hasCurrency(player: Player, amount = 1, currency: Currency) {
    return player.currencies[currency] >= amount;
  }

  hasCoins(player: Player, amount = 1) {
    return this.hasCurrency(player, amount, 'coins' as Currency);
  }

  private attemptLevelUpForPlayer(player: Player) {
    const requiredXp = xpForLevel(player.level + 1);
    if (player.xp < requiredXp) return;

    player.xp = 0;
    player.level += 1;

    void this.notificationService.createNotificationForUser(
      player.userId,
      {
        liveAt: new Date(),
        text: `You have reached level ${player.level}!`,
        actions: [],
      },
      1,
    );
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
    });
  }

  async handleDiscoveries(
    player: Player,
    discoveries: Discoveries,
    location: ILocation,
  ) {
    const locations = location.connections;
    if (locations.length > 0) {
      const discoveredLocation = sample(locations);
      const didDiscover = this.discoveriesService.discoverLocation(
        discoveries,
        discoveredLocation.name,
      );

      if (didDiscover) {
        void this.notificationService.createNotificationForUser(
          player.userId,
          {
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
          1,
        );
      }
    }
  }

  async handleFindCollectible(
    player: Player,
    location: ILocation,
  ): Promise<any> {
    const randomCollectibleForLocation = sample(
      this.contentService
        .allCollectibles()
        .filter((coll) => coll.location === location.name),
    );

    if (!randomCollectibleForLocation) return;

    this.setPlayerAction(player, {
      text: 'Take',
      action: 'collectible',
      actionData: {
        item: randomCollectibleForLocation,
      },
    });
  }

  async handleFindItem(player: Player, location: ILocation): Promise<any> {
    const randomItemForLocation = sample(
      this.contentService
        .allEquipment()
        .filter(
          (item) =>
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
    });
  }
}
