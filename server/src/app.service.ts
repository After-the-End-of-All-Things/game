import { Inject, Injectable } from '@nestjs/common';

import { ROLLBAR_CONFIG } from '@modules/config/rollbar';
import { Logger } from 'nestjs-pino';
import * as Rollbar from 'rollbar';

@Injectable()
export class AppService {
  private rollbar: Rollbar;

  constructor(
    private logger: Logger,
    @Inject(ROLLBAR_CONFIG) private rollbarConfig,
  ) {
    this.rollbar = new Rollbar(this.rollbarConfig);

    this.watchForUncaughtErrors();
  }

  private watchForUncaughtErrors() {
    process.on('uncaughtException', (error: Error) => {
      this.logger.error(error);
      this.rollbar.error(error);
    });

    process.on('unhandledRejection', (error: Error) => {
      this.logger.error(error);
      this.rollbar.error(error);
    });
  }
}
