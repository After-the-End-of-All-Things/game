import { TrackedStat } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Stats } from '@modules/stats/stats.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor(
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
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('stats id already in use.');
      }
    }

    return stats;
  }

  async incrementStat(userId: string, stat: TrackedStat, byValue = 1) {
    const stats = await this.getStatsForUser(userId);
    if (!stats) throw new BadRequestException('Stats not found');

    stats.stats = {
      ...stats.stats,
      [stat]: (stats.stats[stat] ?? 0) + byValue,
    };
  }
}
