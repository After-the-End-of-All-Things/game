import { IMarketItemExpanded, IPagination } from '@interfaces';

export interface IMarketStore {
  version: number;
  claimCoins: number;
  marketData: IPagination<IMarketItemExpanded>;
}
