import { EntityManager } from '@mikro-orm/mongodb';
import { Stats } from '@modules/stats/stats.schema';
import { Injectable } from '@nestjs/common';
import { leaderboardQueries } from '@utils/leaderboard-queries';

@Injectable()
export class LeaderboardService {
  constructor(private readonly em: EntityManager) {}

  async getLeaderboard(location?: string) {
    const data = {};

    for (const query of leaderboardQueries) {
      const matchQuery: any = location
        ? { ...query.query, location }
        : query.query;

      matchQuery.name = { $exists: true };
      matchQuery.portrait = { $ne: -1 };

      const results = await this.em
        .getCollection(Stats)
        .aggregate([
          { $match: matchQuery },
          { $project: query.fields },
          { $sort: query.params.sort },
          { $limit: query.params.limit },
        ])
        .toArray();

      data[query.name] = results.map(query.formatter);
    }

    return data;
  }
}
