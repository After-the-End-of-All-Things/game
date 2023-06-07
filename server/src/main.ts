import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3699', 'https://play.ateoat.com'],
  });
  await app.listen(3000);
}
bootstrap();
