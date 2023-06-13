import {
  Currency,
  IAttachmentHelpers,
  IPlayerStore,
  RechargeableStat,
  Stat,
} from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import { ApplyPlayerPatches, SetPlayer } from './player.actions';

export const defaultStore: () => IPlayerStore = () => ({
  version: 0,
  player: {
    xp: 0,
    level: 1,
    job: 'Generalist',

    location: {
      current: '',
      goingTo: '',
      arrivesAt: Date.now(),
      cooldown: 0,
    },

    profile: {
      shortBio: '',
      longBio: '',
    },

    stats: {
      [Stat.Health]: 50,
      [Stat.Magic]: 0,
      [Stat.Power]: 0,
      [Stat.Resistance]: 0,
      [Stat.Special]: 0,
      [Stat.Toughness]: 0,
    },

    cosmetics: {
      portrait: 4,
      background: 0,
    },

    currencies: {
      [Currency.Coins]: 0,
    },

    recharges: {
      [RechargeableStat.Health]: 0,
    },
  },
});

export function setPlayer(
  ctx: StateContext<IPlayerStore>,
  { player }: SetPlayer
) {
  ctx.patchState({ player });
}

export function applyPlayerPatches(
  ctx: StateContext<IPlayerStore>,
  { patches }: ApplyPlayerPatches,
  helpers?: IAttachmentHelpers
) {
  const player = ctx.getState().player;

  const currentXp = player.xp;
  const currentCoins = player.currencies[Currency.Coins];

  const hasXpPatch = patches.find((patch) => patch.path === '/xp');
  const hasCoinsPatch = patches.find(
    (patch) => patch.path === '/currencies/coins'
  );

  if (hasXpPatch) {
    const xpDiff = (hasXpPatch as any).value - currentXp;
    helpers?.visual.showXpGain(xpDiff);
  }

  if (hasCoinsPatch) {
    const coinsDiff = (hasCoinsPatch as any).value - currentCoins;
    helpers?.visual.showCoinGain(coinsDiff);
  }

  applyPatch(player, patches);

  ctx.patchState({ player });
}
