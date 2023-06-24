import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as GameAnalytics from 'gameanalytics-node-sdk';
import { Logger } from 'nestjs-pino';

import * as packageJSON from '../../../../package.json';

@Injectable()
export class AnalyticsService {
  private analytics: GameAnalytics;

  constructor(private logger: Logger, private configService: ConfigService) {
    const key = this.configService.get<string>('GAMEANALYTICS_KEY');
    const secret = this.configService.get<string>('GAMEANALYTICS_SECRET');

    if (!key || !secret) {
      this.logger.warn('GameAnalytics not configured; skipping.');
      return;
    }

    this.analytics = new GameAnalytics({
      key,
      secret,
      build: packageJSON.version,
      sandbox: false,
    });

    this.logger.log('GameAnalytics configured.');
  }

  private track(userId: string, type: 'design' | 'resource', args: any) {
    if (!this.analytics) return;

    if (args.event_id)
      args.event_id = args.event_id.replace(/[^a-zA-Z0-9:]+/g, '');

    try {
      this.analytics.track(type, userId, args);
    } catch (e) {
      // this.logger.error(e);
    }
  }

  startSession(userId: string, startArgs: any) {
    if (!this.analytics) return;

    this.analytics.sessionStart(userId, {
      ...startArgs,
      session_num: 1,
    });
  }

  sendDesignEvent(userId: string, eventId: string, value = 0) {
    if (!this.analytics) return;

    if (eventId.includes('objectObject')) {
      this.logger.error('Invalid eventId', eventId);
      return;
    }

    this.track(userId, 'design', {
      event_id: eventId,
      amount: value,
    });
  }
}
