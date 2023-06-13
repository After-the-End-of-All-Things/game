import { Injectable } from '@nestjs/common';

import { ILocation } from '@interfaces';
import * as content from '../../../content.json';

@Injectable()
export class ContentService {
  public get content() {
    return (content as any).default || content;
  }

  public get locations(): Record<string, ILocation> {
    return this.content.locations;
  }
}
