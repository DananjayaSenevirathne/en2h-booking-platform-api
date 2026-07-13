import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
  });

  it('/api-json (GET)', () => {
    return request(app.getHttpServer())
      .get('/api-json')
      .expect(200)
      .expect((response) => {
        expect(response.body.openapi).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
