import { GameOption, IOptionsStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { SetOption } from '@stores/options/options.actions';

export const defaultStore: () => IOptionsStore = () => ({
  version: 0,
  options: {
    [GameOption.AssetQuality]: 'medium',
  },
});

export function setOption(
  ctx: StateContext<IOptionsStore>,
  { option, value }: SetOption,
) {
  ctx.setState(
    patch<IOptionsStore>({
      options: patch<Record<GameOption, number | string>>({
        [option]: value,
      }),
    }),
  );
}
