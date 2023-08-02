import { IMarketItemExpanded, IPagination } from '@interfaces';

export class SetMarketItems {
  static type = '[Market] Set Items';
  constructor(public marketData: IPagination<IMarketItemExpanded>) {}
}

export class RemoveMarketItem {
  static type = 'RemoveMarketItem';
  constructor(public listingId: string) {}
}
