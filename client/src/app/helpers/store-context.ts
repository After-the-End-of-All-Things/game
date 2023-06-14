import { inject } from '@angular/core';
import { IAttachmentHelpers } from '@interfaces';
import { VisualService } from '@services/visual.service';

export function getStateHelpers(): IAttachmentHelpers {
  return {
    visual: inject(VisualService),
  };
}
