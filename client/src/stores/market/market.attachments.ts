import { IAttachment } from '../../interfaces';
import {
  RemoveMarketItem,
  RepriceMarketItem,
  SetClaimCoins,
  SetMarketItems,
} from './market.actions';
import {
  removeMarketItem,
  repriceMarketItem,
  setClaimCoins,
  setMarketItems,
} from './market.functions';

export const attachments: IAttachment[] = [
  { action: SetMarketItems, handler: setMarketItems },
  { action: RemoveMarketItem, handler: removeMarketItem },
  { action: RepriceMarketItem, handler: repriceMarketItem },
  { action: SetClaimCoins, handler: setClaimCoins },
];
