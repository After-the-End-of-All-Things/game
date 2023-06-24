import { Injectable } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';

@Injectable()
export class AppService {
  @RollbarHandler()
  getHello(): string {
    throw new Error('Test error');
  }
}
