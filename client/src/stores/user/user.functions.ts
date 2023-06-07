import { StateContext } from '@ngxs/store';
import { IUserStore } from '../../interfaces';
import { SetUser } from './user.actions';

export const defaultStore: () => IUserStore = () => ({
  version: 0,
  user: {
    createdAt: 0,
    discriminator: '',
    email: '',
    username: ''
  }
});

export function resetGame(ctx: StateContext<IUserStore>) {
}

export function setUser(ctx: StateContext<IUserStore>, { user }: SetUser) {
  ctx.patchState({ user });
}
