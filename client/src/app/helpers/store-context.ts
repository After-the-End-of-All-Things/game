import { inject } from '@angular/core';
import { IAttachmentHelpers } from '@interfaces';
import { NotifyService } from '@services/notify.service';
import { VisualService } from '@services/visual.service';

export function getStateHelpers(): IAttachmentHelpers {
  return {
    visual: inject(VisualService),
    notify: inject(NotifyService),
  };
}
