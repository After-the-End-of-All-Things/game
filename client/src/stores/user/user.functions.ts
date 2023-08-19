import { IAttachmentHelpers, IUserStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import { ApplyUserPatches, ChangePage, SetUser } from './user.actions';

export const defaultStore: () => IUserStore = () => ({
  version: 0,
  user: {
    id: '',
    createdAt: new Date(),
    discriminator: '',
    email: '',
    username: '',
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
