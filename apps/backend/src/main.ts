import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // URI-based versioning: /api/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // DTO validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
