import { StateContext } from '@ngxs/store';
import { type VisualService } from '@services/visual.service';

export interface IAttachmentHelpers {
  visual: VisualService;
}

export interface IAttachment {
  action: any;
  handler: (
    ctx: StateContext<any>,
    action?: any,
    helpers?: IAttachmentHelpers
  ) => void;
}
