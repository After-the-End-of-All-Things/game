import { IAttachment } from '@interfaces';
import { SetOption } from '@stores/options/options.actions';
import { setOption } from '@stores/options/options.functions';

export const attachments: IAttachment[] = [
  { action: SetOption, handler: setOption },
];
