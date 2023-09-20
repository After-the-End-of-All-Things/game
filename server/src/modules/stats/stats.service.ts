import { TrackedStat } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { Player } from '@modules/player/player.schema';
import { Stats } from '@modules/stats/stats.schema';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { leaderboardQueries } from '@utils/leaderboard-queries';
import { Logger } from 'nestjs-pino';

@Injectable()
export class StatsService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Stats)
    private readonly stats: EntityRepository<Stats>,
    private readonly userService: UserService,
  ) {}

  async getStatsForUser(userId: string): Promise<Stats | undefined> {
    const dbStats = await this.stats.findOne({ userId });
    if (!dbStats) {
      return await this.createStatsForUser(userId);
    }

    return dbStats;
  }

  async createStatsForUser(userId: string): Promise<Stats | undefined> {
    const stats = new Stats(userId);

    try {
      await this.stats.create(stats);
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException(`stats id ${userId} already in use.`);
      }

      throw e;
    } finally {
      await this.em.flush();
    }

    return stats;
  }

  async getLeaderboardStatsForUser(
    userId: string,
  ): Promise<Array<{ name: string; value: string }>> {
    const stats = await this.getStatsForUser(userId);
    if (!stats) throw new NotFoundException(`Stats ${userId} not found`);

    return leaderboardQueries.map((query) => ({
      name: query.singleUserName,
      value: query.formatter(stats).value,
    }));
  }

  async incrementStat(userId: string, stat: TrackedStat, byValue = 1) {
    const stats = await this.getStatsForUser(userId);
    if (!stats) throw new NotFoundException(`Stats ${userId} not found`);

    this.logger.verbose(
      `Incrementing stat ${stat} by ${byValue} for user ${userId}`,
    );

    stats.stats = {
      ...stats.stats,
      [stat]: (stats.stats[stat] ?? 0) + byValue,
    };
  }

  @OnEvent('sync.player')
  async syncPlayer(player: Player): Promise<void> {
    const stats = await this.getStatsForUser(player.userId);
    if (!stats) throw new NotFoundException(`Stats ${player.userId} not found`);

    const user = await this.userService.findUserById(player.userId);
    if (!user) throw new NotFoundException(`User ${player.userId} not found`);

    stats.name = user.username;
    stats.discriminator = user.discriminator;
    stats.portrait = player.cosmetics.portrait;
    stats.location = player.location.current;

    if (player.level > stats.level) {
      stats.level = player.level;
      stats.job = player.job;
    }

    await this.em.flush();
  }

  @OnEvent('sync.discoveries')
  async syncDiscoveries(discoveries: Discoveries): Promise<void> {
    const stats = await this.getStatsForUser(discoveries.userId);
    if (!stats)
      throw new NotFoundException(`Stats ${discoveries.userId} not found`);

    stats.discoveries = {
      locations: Object.keys(discoveries.locations || {}).length,
      monsters: Object.keys(discoveries.monsters || {}).length,
      backgrounds: Object.keys(discoveries.backgrounds || {}).length,
      portraits: Object.keys(discoveries.portraits || {}).length,
      borders: Object.keys(discoveries.borders || {}).length,
      collectibles: Object.keys(discoveries.collectibles || {}).length,
      items: Object.keys(discoveries.items || {}).length,
      uniqueCollectibleClaims: discoveries.uniqueCollectibleClaims ?? 0,
      uniqueEquipmentClaims: discoveries.uniqueEquipmentClaims ?? 0,
      uniqueMonsterClaims: discoveries.uniqueMonsterClaims ?? 0,
      totalCollectibleClaims: discoveries.totalCollectibleClaims ?? 0,
      totalEquipmentClaims: discoveries.totalEquipmentClaims ?? 0,
      totalMonsterClaims: discoveries.totalMonsterClaims ?? 0,
    };

    await this.em.flush();
  }
}
