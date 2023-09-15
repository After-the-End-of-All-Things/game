import { ConfigService } from '@nestjs/config';
import { isProduction } from '@utils/isprod';

// dev tokens last indefinitely to make the testing client simpler
// there are also no security concerns in dev
const isProd = isProduction();

export const JWT_CONFIG = Symbol('JWT_CONFIG');

export function jwtConfigFactory(configService: ConfigService) {
  const jwtSecret = configService.get<string>('JWT_SECRET', 'supersecret');

  return {
    global: true,
    secret: jwtSecret,
    signOptions: isProd ? { expiresIn: '1800s' } : {},
  };
}

export const jwtConfigProvider = {
  provide: JWT_CONFIG,
  inject: [ConfigService],
  useFactory: jwtConfigFactory,
};
