import { inject } from '@angular/core';
import { IAttachmentHelpers } from '@interfaces';
import { ActionsService } from '@services/actions.service';
import { ContentService } from '@services/content.service';
import { NotifyService } from '@services/notify.service';
import { PlayerService } from '@services/player.service';
import { VisualService } from '@services/visual.service';

export function getStateHelpers(): IAttachmentHelpers {
  return {
    visual: inject(VisualService),
    notify: inject(NotifyService),
    player: inject(PlayerService),
    content: inject(ContentService),
    actions: inject(ActionsService),
  };
}
