import { UserResponse } from '@interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { fromEvent } from 'rxjs';

import { ROLLBAR_CONFIG } from '@modules/config/rollbar';
import { Logger } from 'nestjs-pino';
import * as Rollbar from 'rollbar';

@Injectable()
export class AppService {
  private readonly events = new EventEmitter2();
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

  public subscribe(channel: string) {
    return fromEvent(this.events, channel);
  }

  public emit(channel: string, data: UserResponse = {}) {
    this.events.emit(channel, { data });
  }

  @OnEvent('userdata.send')
  public sendUserData(event: { userId: string; data: any }) {
    this.emit(event.userId, event.data);
  }
}
