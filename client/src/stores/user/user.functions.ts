import { IAttachmentHelpers, IUserStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import {
  ApplyAchievementsPatches,
  SetAchievements,
} from '@stores/achievements/achievements.actions';
import {
  ApplyCraftingPatches,
  SetCrafting,
} from '@stores/crafting/crafting.actions';
import {
  ApplyDiscoveriesPatches,
  SetDiscoveries,
} from '@stores/discoveries/discoveries.actions';
import {
  ApplyFightPatches,
  ClearFight,
  SetFight,
} from '@stores/fight/fight.actions';
import {
  ApplyInventoryPatches,
  SetInventory,
} from '@stores/inventory/inventory.actions';
import { SetNotifications } from '@stores/notifications/notifications.actions';
import { ApplyPlayerPatches, SetPlayer } from '@stores/player/player.actions';
import { ApplyStatsPatches, SetStats } from '@stores/stats/stats.actions';
import { applyPatch } from 'fast-json-patch';
import { isArray } from 'lodash';
import { ApplyUserPatches, ChangePage, SetUser } from './user.actions';

export const defaultStore: () => IUserStore = () => ({
  version: 0,
  user: {
    id: '',
    createdAt: new Date(),
    discriminator: '',
    email: '',
    username: '',
    emailVerified: false,
    temporaryPassword: '',
    verificationCode: '',
    verificationExpiration: 0,
  },
});

export function setUser(ctx: StateContext<IUserStore>, { user }: SetUser) {
  ctx.patchState({ user });
}

export function applyUserPatches(
  ctx: StateContext<IUserStore>,
  { patches }: ApplyUserPatches,
) {
  const user = ctx.getState().user;

  applyPatch(user, patches);

  ctx.patchState({ user });
}

export function changePage(
  ctx: StateContext<IUserStore>,
  { newPage }: ChangePage,
  helpers?: IAttachmentHelpers,
) {
  helpers?.actions.changePage(newPage);
}

export function grabData(ctx: StateContext<IUserStore>, { data }: any) {
  if (data.user) {
    if (isArray(data.user)) {
      if (data.user.length > 0) {
        ctx.dispatch(new ApplyUserPatches(data.user));
      }
    } else {
      ctx.dispatch(new SetUser(data.user));
    }
  }

  if (data.player) {
    if (isArray(data.player)) {
      if (data.player.length > 0) {
        ctx.dispatch(new ApplyPlayerPatches(data.player));
      }
    } else {
      ctx.dispatch(new SetPlayer(data.player));
    }
  }

  if (data.stats) {
    if (isArray(data.stats)) {
      if (data.stats.length > 0) {
        ctx.dispatch(new ApplyStatsPatches(data.stats));
      }
    } else {
      ctx.dispatch(new SetStats(data.stats));
    }
  }

  if (data.achievements) {
    if (isArray(data.achievements)) {
      if (data.achievements.length > 0) {
        ctx.dispatch(new ApplyAchievementsPatches(data.achievements));
      }
    } else {
      ctx.dispatch(new SetAchievements(data.achievements));
    }
  }

  if (data.discoveries) {
    if (isArray(data.discoveries)) {
      if (data.discoveries.length > 0) {
        ctx.dispatch(new ApplyDiscoveriesPatches(data.discoveries));
      }
    } else {
      ctx.dispatch(new SetDiscoveries(data.discoveries));
    }
  }

  if (data.crafting) {
    if (isArray(data.crafting)) {
      if (data.crafting.length > 0) {
        ctx.dispatch(new ApplyCraftingPatches(data.crafting));
      }
    } else {
      ctx.dispatch(new SetCrafting(data.crafting));
    }
  }

  if (data.inventory) {
    if (isArray(data.inventory)) {
      if (data.inventory.length > 0) {
        ctx.dispatch(new ApplyInventoryPatches(data.inventory));
      }
    } else {
      ctx.dispatch(new SetInventory(data.inventory));
    }
  }

  if (data.fight) {
    if (isArray(data.fight)) {
      if (data.fight.length > 0) {
        ctx.dispatch(new ApplyFightPatches(data.fight));
      }
    } else {
      ctx.dispatch(new SetFight(data.fight));
    }
  } else if (data.fight === null) {
    ctx.dispatch(new ClearFight());
  }

  if (data.notifications) {
    ctx.dispatch(new SetNotifications(data.notifications));
  }

  if (data.actions) {
    ctx.dispatch(data.actions);
  }
}
