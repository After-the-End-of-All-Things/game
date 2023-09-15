import { PlayerApi } from './_types';

const fleeId = 'a5b5f22e-7912-48ba-b3b3-c0481b151a12';

export function getAction(playerApi: PlayerApi) {
  return playerApi.player.player.action;
}

export function hasAction(playerApi: PlayerApi): boolean {
  return !!playerApi.player.player.action;
}

export function doesActionRequireAttention(playerApi: PlayerApi): boolean {
  const action = getAction(playerApi);
  return [
    'fight',
    'item',
    'collectible',
    'resource',
    'wave',
    'change',
  ].includes(action.action);
}

export function hasFight(playerApi: PlayerApi): boolean {
  return playerApi.player.fight;
}

export function fleeFight(playerApi: PlayerApi) {
  return playerApi.api
    .url(`/fight/action`)
    .post({ actionId: fleeId, targetParams: {} })
    .res();
}

export async function handleAction(playerApi: PlayerApi) {
  if (!hasAction(playerApi)) return;

  const action = getAction(playerApi);

  console.info(`${playerApi.name} is handling action: ${action.action}`);
  return playerApi.api.url(`/${action.url}`).post().json();
}

export async function explore(playerApi: PlayerApi) {
  console.info(`${playerApi.name} is exploring...`);

  await playerApi.api.url(`/gameplay/explore`).post().json();
}
