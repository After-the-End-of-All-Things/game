import { IMarketItemExpanded, IPagination } from '@interfaces';

export interface IMarketStore {
  version: number;
  marketData: IPagination<IMarketItemExpanded>;
}
