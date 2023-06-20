import { ConfigService } from '@nestjs/config';

export const JWT_CONFIG = Symbol('JWT_CONFIG');

export function jwtConfigFactory(configService: ConfigService) {
  const jwtSecret = configService.get<string>('JWT_SECRET', 'supersecret');

  return {
    global: true,
    secret: jwtSecret,
    signOptions: { expiresIn: '1800s' },
  };
}

export const jwtConfigProvider = {
  provide: JWT_CONFIG,
  inject: [ConfigService],
  useFactory: jwtConfigFactory,
};
