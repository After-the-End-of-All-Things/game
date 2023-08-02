import { IMarketItemExpanded, IMarketStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';
import { RemoveMarketItem, SetMarketItems } from './market.actions';

export const defaultStore: () => IMarketStore = () => ({
  version: 0,
  marketData: {
    lastPage: 0,
    page: 0,
    results: [],
    total: 0,
    limit: 25,
  },
});

export function setMarketItems(
  ctx: StateContext<IMarketStore>,
  { marketData }: SetMarketItems,
) {
  ctx.setState(
    patch({
      marketData,
    }),
  );
}

export function removeMarketItem(
  ctx: StateContext<IMarketStore>,
  { listingId }: RemoveMarketItem,
) {
  ctx.setState(
    patch({
      marketData: patch({
        results: removeItem<IMarketItemExpanded>(
          (item) => item.id === listingId,
        ),
      }),
    }),
  );
}
