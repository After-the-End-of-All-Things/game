import { PlayerApi } from './_types';

export async function getPlayerInventory(player: PlayerApi): Promise<any> {
  return player.api.url(`/inventory/items`).get().json();
}
