import { ConfigService } from '@nestjs/config';

export const ROLLBAR_CONFIG = Symbol('ROLLBAR_CONFIG');

export function rollbarConfigFactory(configService: ConfigService) {
  const accessToken = configService.get<string>('ROLLBAR_TOKEN');
  const environment = configService.get<string>('NODE_ENV', 'local');

  return {
    accessToken,
    environment,
    enabled: !!accessToken,
  };
}

export const rollbarConfigProvider = {
  provide: ROLLBAR_CONFIG,
  inject: [ConfigService],
  useFactory: rollbarConfigFactory,
};
