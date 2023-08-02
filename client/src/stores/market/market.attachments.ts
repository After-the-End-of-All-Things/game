import { IAttachment } from '../../interfaces';
import { RemoveMarketItem, SetMarketItems } from './market.actions';
import { removeMarketItem, setMarketItems } from './market.functions';

export const attachments: IAttachment[] = [
  { action: SetMarketItems, handler: setMarketItems },
  { action: RemoveMarketItem, handler: removeMarketItem },
];
