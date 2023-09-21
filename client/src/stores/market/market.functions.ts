import { IMarketItemExpanded, IMarketStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import {
  RemoveMarketItem,
  RepriceMarketItem,
  SetClaimCoins,
  SetMarketItems,
} from './market.actions';

export const defaultStore: () => IMarketStore = () => ({
  version: 0,
  claimCoins: 0,
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
          (item) => item.internalId === listingId,
        ),
      }),
    }),
  );
}

export function repriceMarketItem(
  ctx: StateContext<IMarketStore>,
  { listingId, newPrice }: RepriceMarketItem,
) {
  ctx.setState(
    patch({
      marketData: patch({
        results: updateItem<IMarketItemExpanded>(
          (item) => item.internalId === listingId,
          patch({
            price: newPrice,
          }),
        ),
      }),
    }),
  );
}

export function setClaimCoins(
  ctx: StateContext<IMarketStore>,
  { coins }: SetClaimCoins,
) {
  ctx.setState(
    patch({
      claimCoins: coins,
    }),
  );
}
