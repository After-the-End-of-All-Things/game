import * as Rollbar from 'rollbar';

import { ErrorHandler, Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root',
})
export class RollbarService {
  private rollbar!: Rollbar;

  public get rollbarInstance() {
    return this.rollbar;
  }

  constructor() {}

  init() {
    const rollbarConfig = {
      accessToken: environment.rollbar.apiKey,
      captureUncaught: true,
      captureUnhandledRejections: true,
      hostBlockList: ['netlify.app'],
      hostSafelist: ['ateoat.com'],
      payload: {
        environment: environment.rollbar.environment,
      },
    };

    this.rollbar = new Rollbar(rollbarConfig);
  }
}

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(
    private store: Store,
    private notify: NotifyService,
    private rollbar: RollbarService,
  ) {
    window.onerror = (err) => this.handleError(err);
  }

  private isValidError(err: any): boolean {
    if (err.message.includes('Firebase') && err.message.includes('auth/')) {
      return false;
    }

    return true;
  }

  handleError(err: any): void {
    console.error(err);

    if (!this.isValidError(err)) {
      return;
    }

    // send the error, and possibly the savefile
    this.rollbar.rollbarInstance?.error(err.originalError || err);
  }
}
