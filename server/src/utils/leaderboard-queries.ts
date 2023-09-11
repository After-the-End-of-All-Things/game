const numPlayersPerCategory = 10;
const alwaysFields = { userId: 1, discriminator: 1, name: 1, portrait: 1 };

const alwaysData = (data) => ({
  userId: data.userId,
  name: `${data.name}#${data.discriminator}`,
  portrait: data.portrait,
});

export const leaderboardQueries = [
  {
    name: 'Player: Highest Level',
    singleUserName: 'Level',
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
      name: 'Collections: Most Backgrounds Discovered',
      singleUserName: 'Backgrounds Discovered',
      stat: 'backgrounds',
    },
    {
      name: 'Collections: Most Collectibles Discovered',
      singleUserName: 'Collectibles Discovered',
      stat: 'collectibles',
    },
    {
      name: 'Collections: Most Items Discovered',
      singleUserName: 'Items Discovered',
      stat: 'items',
    },
    {
      name: 'Collections: Most Locations Discovered',
      singleUserName: 'Locations Discovered',
      stat: 'locations',
    },
    {
      name: 'Collections: Most Monsters Discovered',
      singleUserName: 'Monsters Discovered',
      stat: 'monsters',
    },
    {
      name: 'Collections: Most Portraits Discovered',
      singleUserName: 'Portraits Discovered',
      stat: 'portraits',
    },
  ].map(({ name, singleUserName, stat }) => ({
    name,
    singleUserName,
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
  ...[
    {
      name: 'Combat: Most Victories',
      singleUserName: 'Combat Victories',
      stat: 'combatWins',
    },
    {
      name: 'Crafting: Most Items Crafted',
      singleUserName: 'Items Crafted',
      stat: 'itemsCrafted',
    },
    {
      name: 'Exploration: Most Class Changes',
      singleUserName: 'Class Changes',
      stat: 'classChanges',
    },
    {
      name: 'Exploration: Most Waves',
      singleUserName: 'Waves',
      stat: 'wavesTo',
    },
  ].map(({ name, singleUserName, stat }) => ({
    name,
    singleUserName,
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
];
