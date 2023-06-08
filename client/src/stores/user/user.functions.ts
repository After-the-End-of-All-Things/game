import { IUserStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { SetUser } from './user.actions';

export const defaultStore: () => IUserStore = () => ({
  version: 0,
  user: {
    createdAt: new Date(),
    discriminator: '',
    email: '',
    username: '',
  },
});

export function setUser(ctx: StateContext<IUserStore>, { user }: SetUser) {
  ctx.patchState({ user });
}
