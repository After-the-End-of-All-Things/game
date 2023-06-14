import { xpForLevel } from '@helpers/xp';
import { Currency, ILocation } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Player } from '@modules/player/player.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import * as jsonpatch from 'fast-json-patch';
import { random, sample } from 'lodash';

@Injectable()
export class PlayerService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Player)
    private readonly players: EntityRepository<Player>,
    private readonly discoveriesService: DiscoveriesService,
  ) {}

  async getPlayerForUser(userId: string): Promise<Player> {
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

    return getPatchesAfterPropChanges<Player>(player, async (playerRef) => {
      playerRef.cosmetics = { ...player.cosmetics, portrait };
    });
  }

  gainXpForPlayer(player: Player, xp = 1) {
    player.xp += xp;
    this.attemptLevelUpForPlayer(player);
  }

  gainCurrencyForPlayer(player: Player, amount = 1, currency: Currency) {
    player.currencies[currency] ??= 0;
    player.currencies[currency] += amount;
    player.currencies = { ...player.currencies };
  }

  gainCoinsForPlayer(player: Player, amount = 1) {
    this.gainCurrencyForPlayer(player, amount, 'coins' as Currency);
  }

  private attemptLevelUpForPlayer(player: Player) {
    const requiredXp = xpForLevel(player.level + 1);
    if (player.xp < requiredXp) return;

    player.xp = 0;
    player.level += 1;
  }

  async handleDiscoveries(
    player: Player,
    discoveries: Discoveries,
    location: ILocation,
  ) {
    const locations = location.connections;
    if (locations.length > 0) {
      const discoverChance = location.baseStats.locationFind;
      const discoverRoll = random(0, 100);

      if (discoverRoll <= discoverChance) {
        const discoveredLocation = sample(locations);
        this.discoveriesService.discoverLocation(
          discoveries,
          discoveredLocation.name,
        );
      }
    }
  }
}
