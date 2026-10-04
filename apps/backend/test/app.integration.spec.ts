import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

// Integration tests require a running PostgreSQL instance.
// Run: docker compose up -d postgres
describe('AppModule (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/client/health returns 200', () => {
    return request(app.getHttpServer()).get('/api/v1/client/health').expect(200);
  });

  it('GET /api/v1/admin/health returns 200', () => {
    return request(app.getHttpServer()).get('/api/v1/admin/health').expect(200);
  });
});
