import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3699', 'https://play.ateoat.com'],
  });

  const config = new DocumentBuilder()
    .setTitle('ateoat API')
    .setDescription('The ateoat REST API')
    .setVersion('dev')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = +(process.env.PORT || '3000') || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
