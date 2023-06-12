import { IAttachment } from '../../interfaces';
import { ApplyDiscoveriesPatches, SetDiscoveries } from './discoveries.actions';
import {
  applyDiscoveriesPatches,
  setDiscoveries,
} from './discoveries.functions';

export const attachments: IAttachment[] = [
  { action: SetDiscoveries, handler: setDiscoveries },
  { action: ApplyDiscoveriesPatches, handler: applyDiscoveriesPatches },
];
