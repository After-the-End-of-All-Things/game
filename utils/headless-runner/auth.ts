import { PlayerApi } from './_types';
import { createApi, defaultApi } from './api';

export async function getPlayer(name: string) {
  return defaultApi
    .url(`/auth/login`)
    .post({
      email: `${name}@ateoat.dev`,
      password: 'testtesttesttesttesttest',
      username: name,
    })
    .json();
}

export async function register(name: string) {
  return defaultApi
    .url(`/auth/register`)
    .post({
      email: `${name}@ateoat.dev`,
      password: 'testtesttesttesttesttest',
      username: name,
    })
    .res();
}

export async function login(name: string): Promise<PlayerApi> {
  const player: any = await getPlayer(name);
  const api = createApi().auth(`Bearer ${player.access_token || ''}`);

  return { name, api, player, items: [] };
}
