import { Injectable } from '@nestjs/common';

import { ILocation } from '@interfaces';
import * as fs from 'fs-extra';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ContentService {
  public content = { locations: {} };

  public get locations(): Record<string, ILocation> {
    return this.content.locations;
  }

  constructor(private logger: Logger) {}

  public async reloadContent() {
    this.logger.log('Loading game content over HTTP...');

    try {
      const data = await fetch('https://content.ateoat.com/content.json');
      const json = await data.json();

      this.content = json;

      // this isn't relevant in the game server context, but is useful in case someone forgets to run setup
      fs.writeJsonSync('content.json', json);
    } catch (e) {
      console.error(e);
    }
  }

  public async onModuleInit() {
    if (fs.existsSync('content.json')) {
      this.logger.log('Content exists locally; loading from file.');
      const content = fs.readJsonSync('content.json');
      this.content = content;
      return;
    }

    await this.reloadContent();
  }
}
