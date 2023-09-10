import { EntityManager } from '@mikro-orm/mongodb';
import { Stats } from '@modules/stats/stats.schema';
import { Injectable } from '@nestjs/common';

/* 
TODO: - make leaderboard for: level (player), most equipment/collectible/monster claims (discoveries), most portrait/location/background discovered (discoveries), each stat (stats)

use em.aggregate()?

display:

- stat/value
- player
- portrait
- name
- link to player page
*/

const numPlayersPerCategory = 10;
const alwaysFields = { userId: 1, discriminator: 1, name: 1, portrait: 1 };

const alwaysData = (data) => ({
  userId: data.userId,
  name: `${data.name}#${data.discriminator}`,
  portrait: data.portrait,
});

const queries = [
  {
    name: 'Player: Highest Level',
    query: { level: { $gt: 0 } },
    fields: { ...alwaysFields, level: 1 },
    params: { sort: { level: -1 }, limit: numPlayersPerCategory },
    formatter: (data) => {
      return {
        ...alwaysData(data),
        value: `Lv. ${data.level.toLocaleString()}`,
      };
    },
  },
  ...[
    {
      name: 'Combat: Most Victories',
      stat: 'combatWins',
    },
    {
      name: 'Crafting: Most Items Crafted',
      stat: 'itemsCrafted',
    },
    {
      name: 'Exploration: Most Class Changes',
      stat: 'classChanges',
    },
    {
      name: 'Exploration: Most Waves',
      stat: 'wavesTo',
    },
  ].map(({ name, stat }) => ({
    name,
    query: { [`stats.${stat}`]: { $gt: 0 } },
    fields: { ...alwaysFields, [`stats.${stat}`]: 1 },
    params: { sort: { [`stats.${stat}`]: -1 }, limit: numPlayersPerCategory },
    formatter: (data) => {
      return {
        ...alwaysData(data),
        value: data.stats[stat].toLocaleString(),
      };
    },
  })),
  ...[
    {
      name: 'Discoveries: Most Backgrounds Discovered',
      stat: 'backgrounds',
    },
    {
      name: 'Discoveries: Most Collectibles Discovered',
      stat: 'collectibles',
    },
    {
      name: 'Discoveries: Most Items Discovered',
      stat: 'items',
    },
    {
      name: 'Discoveries: Most Locations Discovered',
      stat: 'locations',
    },
    {
      name: 'Discoveries: Most Monsters Discovered',
      stat: 'monsters',
    },
    {
      name: 'Discoveries: Most Portraits Discovered',
      stat: 'portraits',
    },
  ].map(({ name, stat }) => ({
    name,
    query: { [`discoveries.${stat}`]: { $gt: 0 } },
    fields: { ...alwaysFields, [`discoveries.${stat}`]: 1 },
    params: {
      sort: { [`discoveries.${stat}`]: -1 },
      limit: numPlayersPerCategory,
    },
    formatter: (data) => {
      return {
        ...alwaysData(data),
        value: data.discoveries[stat].toLocaleString(),
      };
    },
  })),
];

@Injectable()
export class LeaderboardService {
  constructor(private readonly em: EntityManager) {}

  async getLeaderboard(location?: string) {
    const data = {};

    for (const query of queries) {
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
