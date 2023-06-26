import { StateContext } from '@ngxs/store';
import { type NotifyService } from '@services/notify.service';
import { type VisualService } from '@services/visual.service';

export interface IAttachmentHelpers {
  visual: VisualService;
  notify: NotifyService;
}

export interface IAttachment {
  action: any;
  handler: (
    ctx: StateContext<any>,
    action?: any,
    helpers?: IAttachmentHelpers,
  ) => void;
}
