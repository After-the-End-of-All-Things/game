import { xpForLevel } from '@helpers/xp';
import {
  Currency,
  IAttachmentHelpers,
  IPlayerStore,
  OOCBuff,
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
    userId: '',
    otherJobLevels: {},
    otherJobXp: {},

    location: {
      current: '',
      goingTo: '',
      arrivesAt: Date.now(),
      cooldown: 0,
    },

    profile: {
      displayName: '',
      discriminator: '',
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
      background: -1,
      showcase: {
        collectibles: [],
        items: [],
      },
    },

    currencies: {
      [Currency.Coins]: 0,
      [Currency.Oats]: 0,
    },

    recharges: {
      [RechargeableStat.Health]: 0,
    },

    deityPrayerCooldown: 0,
    deityBuffs: {
      [OOCBuff.Coins]: 0,
      [OOCBuff.Defense]: 0,
      [OOCBuff.Nothing]: 0,
      [OOCBuff.Offense]: 0,
      [OOCBuff.TravelSpeed]: 0,
      [OOCBuff.XP]: 0,
    },
  },
});

export function setPlayer(
  ctx: StateContext<IPlayerStore>,
  { player }: SetPlayer,
) {
  ctx.patchState({ player });
}

export function applyPlayerPatches(
  ctx: StateContext<IPlayerStore>,
  { patches }: ApplyPlayerPatches,
  helpers?: IAttachmentHelpers,
) {
  const player = ctx.getState().player;

  const currentXp = player.xp;
  const currentCoins = player.currencies[Currency.Coins];

  const hasXpPatch = patches.find((patch) => patch.path === '/xp');
  const hasCoinsPatch = patches.find(
    (patch) => patch.path === '/currencies/coins',
  );

  if (hasXpPatch) {
    const xpDiff = (hasXpPatch as any).value - currentXp;
    if (xpDiff > 0) {
      helpers?.visual.showXpGain(xpDiff);
    } else {
      const oldLevelMaxXp = xpForLevel(player.level);
      const diff = oldLevelMaxXp - currentXp;

      helpers?.visual.showXpGain(diff);
    }
  }

  if (hasCoinsPatch) {
    const coinsDiff = (hasCoinsPatch as any).value - currentCoins;
    helpers?.visual.showCoinGain(coinsDiff);
  }

  applyPatch(player, patches);

  player.stats = { ...player.stats };
  player.location = { ...player.location };
  player.recharges = { ...player.recharges };
  player.currencies = { ...player.currencies };
  player.profile = { ...player.profile };
  player.cosmetics = { ...player.cosmetics };

  if (player.action) {
    player.action = { ...player.action };

    if (player.action.actionData) {
      player.action.actionData = {
        ...player.action.actionData,
      };
    }
  }

  ctx.patchState({ player });
}
