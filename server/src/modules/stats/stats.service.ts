import { TrackedStat } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Stats } from '@modules/stats/stats.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class StatsService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Stats)
    private readonly stats: EntityRepository<Stats>,
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
      await this.em.flush();
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('stats id already in use.');
      }

      throw e;
    }

    return stats;
  }

  async incrementStat(userId: string, stat: TrackedStat, byValue = 1) {
    const stats = await this.getStatsForUser(userId);
    if (!stats) throw new BadRequestException('Stats not found');

    this.logger.verbose(
      `Incrementing stat ${stat} by ${byValue} for user ${userId}`,
    );

    stats.stats = {
      ...stats.stats,
      [stat]: (stats.stats[stat] ?? 0) + byValue,
    };
  }
}
