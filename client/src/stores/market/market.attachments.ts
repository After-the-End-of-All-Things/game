import { IAttachment } from '../../interfaces';
import {
  RemoveMarketItem,
  RepriceMarketItem,
  SetMarketItems,
} from './market.actions';
import {
  removeMarketItem,
  repriceMarketItem,
  setMarketItems,
} from './market.functions';

export const attachments: IAttachment[] = [
  { action: SetMarketItems, handler: setMarketItems },
  { action: RemoveMarketItem, handler: removeMarketItem },
  { action: RepriceMarketItem, handler: repriceMarketItem },
];
