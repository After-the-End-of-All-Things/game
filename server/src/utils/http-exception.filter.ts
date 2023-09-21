import { ROLLBAR_CONFIG } from '@modules/config/rollbar';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Rollbar from 'rollbar';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly ignoredCodes = [401, 404];
  private rollbar: Rollbar;

  constructor(@Inject(ROLLBAR_CONFIG) private rollbarConfig) {
    this.rollbar = new Rollbar(this.rollbarConfig);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (this.rollbar && !this.ignoredCodes.includes(status)) {
      this.rollbar.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
