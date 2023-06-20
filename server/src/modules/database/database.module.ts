import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { MIKRO_ORM_CONFIG } from '../config/mikro-orm-config';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [MIKRO_ORM_CONFIG],
      useFactory: (mikroOrmConfig) => ({
        ...mikroOrmConfig,
        findOneOrFailHandler: (entityName: string) =>
          new NotFoundException(`No such ${entityName}`),
      }),
    }),
  ],
})
export class DatabaseModule {}
