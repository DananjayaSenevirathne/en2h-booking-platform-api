import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('EN2H Booking Platform API')
    .setDescription(
      'RESTful API for the EN2H Booking Platform built with NestJS and Prisma.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    ` Application running at: http://localhost:${process.env.PORT ?? 3000}`,
  );

  console.log(
    ` Swagger UI available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

void bootstrap();
