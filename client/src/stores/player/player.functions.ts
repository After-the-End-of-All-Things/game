import { StateContext } from '@ngxs/store';
import {
  Currency,
  IPlayerStore,
  RechargeableStat,
  Stat,
} from '../../interfaces';
import { SetPlayer } from './player.actions';

export const defaultStore: () => IPlayerStore = () => ({
  version: 0,
  player: {
    xp: 0,
    level: 1,
    location: '',

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

export function resetGame(ctx: StateContext<IPlayerStore>) {}

export function setPlayer(
  ctx: StateContext<IPlayerStore>,
  { player }: SetPlayer
) {
  ctx.patchState({ player });
}
