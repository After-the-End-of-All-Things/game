import { StateContext } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { type NotifyService } from '@services/notify.service';
import { PlayerService } from '@services/player.service';
import { type VisualService } from '@services/visual.service';

export interface IAttachmentHelpers {
  visual: VisualService;
  notify: NotifyService;
  player: PlayerService;
  content: ContentService;
}

export interface IAttachment {
  action: any;
  handler: (
    ctx: StateContext<any>,
    action?: any,
    helpers?: IAttachmentHelpers,
  ) => void;
}
