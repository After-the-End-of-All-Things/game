import { PlayerApi } from './_types';
import {
  doesActionRequireAttention,
  explore,
  fleeFight,
  handleAction,
  hasAction,
  hasFight,
} from './actions';
import { getPlayer, login, register } from './auth';
import { getPlayerInventory } from './inventory';
import {
  hasEnoughCoins,
  hasItems,
  hasResources,
  sellRandomItem,
  sellRandomResource,
} from './market';
import { canWorship, worshipRandomDeity } from './worship';

export async function gameloop(playerApi: PlayerApi) {
  try {
    const newPlayer = await getPlayer(playerApi.name);
    const items = await getPlayerInventory(playerApi);

    playerApi.player = newPlayer;
    playerApi.items = items.items;
  } catch (e) {
    console.error('Error... server down? Skipping action...');
  }

  if (canWorship(playerApi)) {
    await worshipRandomDeity(playerApi);
  }

  if (hasResources(playerApi) && hasEnoughCoins(playerApi)) {
    await sellRandomResource(playerApi);
  }

  if (hasItems(playerApi) && hasEnoughCoins(playerApi)) {
    await sellRandomItem(playerApi);
  }

  if (hasFight(playerApi)) {
    await fleeFight(playerApi);
    return;
  }

  if (hasAction(playerApi) && doesActionRequireAttention(playerApi)) {
    await handleAction(playerApi);
    return;
  }

  await explore(playerApi);
}

export async function play(name: string, index: number) {
  try {
    await register(name);
  } catch {}

  try {
    const playerApi = await login(name);

    setInterval(() => gameloop(playerApi), 1000);
  } catch (e) {
    console.error(e);
  }
}
