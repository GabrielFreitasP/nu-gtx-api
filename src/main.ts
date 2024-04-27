import 'newrelic';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const options = new DocumentBuilder()
    .setTitle('Nu GTX API')
    .setDescription('API for stock and orders management')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const apiPort = process.env.API_PORT || 3000;
  await app.listen(apiPort);

  const logger = app.get(Logger);
  logger.log(`Nest application running in port ${apiPort}`, 'NestApplication');
}

bootstrap();
