import { IMarketItemExpanded, IPagination } from '@interfaces';

export class SetMarketItems {
  static type = '[Market] Set Items';
  constructor(public marketData: IPagination<IMarketItemExpanded>) {}
}

export class RemoveMarketItem {
  static type = 'RemoveMarketItem';
  constructor(public listingId: string) {}
}

export class RepriceMarketItem {
  static type = 'RepriceMarketItem';
  constructor(public listingId: string, public newPrice: number) {}
}

export class SetClaimCoins {
  static type = '[Market] Set Claim Coins';
  constructor(public coins: number) {}
}
