import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { AdminAuthController } from './admin-auth.controller';
import { AuthService } from '../../auth/auth.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';

const authMock = {
  validateAdmin: jest.fn(),
  issueTokens: jest.fn(),
  refreshTokens: jest.fn(),
  revokeRefreshToken: jest.fn(),
};

const mockJwtGuard = {
  canActivate: jest.fn().mockImplementation((ctx) => {
    ctx.switchToHttp().getRequest().user = { id: 'admin-1', type: 'admin', role: 'SUPER_ADMIN' };
    return true;
  }),
};

const tokens = { accessToken: 'acc', refreshToken: 'ref', expiresIn: 900 };
const adminRecord = {
  id: 'admin-1',
  email: 'admin@petlanka.lk',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'SUPER_ADMIN',
};

describe('AdminAuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [{ provide: AuthService, useValue: authMock }],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    app = module.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(() => app.close());
  afterEach(() => jest.clearAllMocks());

  // ─── POST /v1/admin/auth/login ──────────────────────────────────────────────

  describe('POST /v1/admin/auth/login', () => {
    it('returns 201 with tokens and admin data on valid credentials', async () => {
      authMock.validateAdmin.mockResolvedValue(adminRecord);
      authMock.issueTokens.mockResolvedValue(tokens);

      const res = await request(app.getHttpServer())
        .post('/v1/admin/auth/login')
        .send({ email: 'admin@petlanka.lk', password: 'correct-pass' })
        .expect(201);

      expect(res.body).toMatchObject({
        accessToken: 'acc',
        admin: { email: 'admin@petlanka.lk', role: 'SUPER_ADMIN' },
      });
    });

    it('returns 401 for wrong password', async () => {
      authMock.validateAdmin.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/v1/admin/auth/login')
        .send({ email: 'admin@petlanka.lk', password: 'wrong-pass' })
        .expect(401);
    });

    it('returns 400 when email is missing', async () => {
      await request(app.getHttpServer())
        .post('/v1/admin/auth/login')
        .send({ password: 'somepassword' })
        .expect(400);
    });

    it('returns 400 when password is shorter than 8 chars', async () => {
      await request(app.getHttpServer())
        .post('/v1/admin/auth/login')
        .send({ email: 'admin@petlanka.lk', password: 'short' })
        .expect(400);
    });
  });

  // ─── POST /v1/admin/auth/refresh ───────────────────────────────────────────

  describe('POST /v1/admin/auth/refresh', () => {
    it('returns 201 with new tokens', async () => {
      authMock.refreshTokens.mockResolvedValue({
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
        expiresIn: 900,
      });

      const res = await request(app.getHttpServer())
        .post('/v1/admin/auth/refresh')
        .send({ refreshToken: 'old-token' })
        .expect(201);

      expect(res.body).toMatchObject({ accessToken: 'new-acc' });
    });

    it('returns 401 for an expired refresh token', async () => {
      authMock.refreshTokens.mockRejectedValue(new UnauthorizedException());

      await request(app.getHttpServer())
        .post('/v1/admin/auth/refresh')
        .send({ refreshToken: 'bad-token' })
        .expect(401);
    });
  });

  // ─── POST /v1/admin/auth/logout ────────────────────────────────────────────

  describe('POST /v1/admin/auth/logout', () => {
    it('returns 200 and revokes token when authenticated', async () => {
      authMock.revokeRefreshToken.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .post('/v1/admin/auth/logout')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send({ refreshToken: 'some-token' })
        .expect(200);

      expect(authMock.revokeRefreshToken).toHaveBeenCalledWith('some-token');
    });

    it('returns 403 when guard blocks the request', async () => {
      mockJwtGuard.canActivate.mockReturnValueOnce(false);

      await request(app.getHttpServer())
        .post('/v1/admin/auth/logout')
        .send({ refreshToken: 'tok' })
        .expect(403);
    });
  });
});
