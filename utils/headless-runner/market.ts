import { PlayerApi } from './_types';

export function hasEnoughCoins(playerApi: PlayerApi): boolean {
  return playerApi.player.player.currencies.coins > 200;
}

export function hasResources(playerApi: PlayerApi): boolean {
  return Object.keys(playerApi.player.inventory.resources).length > 0;
}

export async function sellRandomResource(playerApi: PlayerApi) {
  const resourceId = Object.keys(playerApi.player.inventory.resources).filter(
    (res) => playerApi.player.inventory.resources[res] > 0,
  )[0];
  if (!resourceId) return;

  console.info(`${playerApi.name} is selling resource: ${resourceId}...`);

  return playerApi.api
    .url('/market/listings')
    .put({
      instanceId: resourceId,
      price: 100,
      quantity: playerApi.player.inventory.resources[resourceId],
    })
    .json();
}

export function hasItems(playerApi: PlayerApi): boolean {
  return playerApi.items.length > 0;
}

export async function sellRandomItem(playerApi: PlayerApi) {
  const item = playerApi.items[0];
  if (!item) return;

  console.info(
    `${playerApi.name} is selling item: ${item.instanceId}/${item.itemId}...`,
  );

  return playerApi.api
    .url('/market/listings')
    .put({
      instanceId: item.instanceId,
      price: 1000,
      quantity: 1,
    })
    .json();
}
