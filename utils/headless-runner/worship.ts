import { PlayerApi } from './_types';

export function canWorship(playerApi: PlayerApi): boolean {
  return (playerApi.player.player.deityPrayerCooldown ?? 0) < Date.now();
}

export async function worshipRandomDeity(playerApi: PlayerApi): Promise<any> {
  const deities = ['travel', 'xp', 'coins', 'offense', 'defense', 'nothing'];
  const randomDeity = deities[Math.floor(Math.random() * deities.length)];

  console.info(`${playerApi.name} is worshipping: ${randomDeity}...`);

  return playerApi.api
    .url(`/gameplay/worship`)
    .post({ deity: randomDeity })
    .json();
}
