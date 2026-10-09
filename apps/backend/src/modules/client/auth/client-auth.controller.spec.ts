import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { ClientAuthController } from './client-auth.controller';
import { AuthService } from '../../auth/auth.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { prismaMock, prismaMockProvider } from '../../../test/prisma-mock';

const authMock = {
  generateOtp: jest.fn(),
  verifyOtp: jest.fn(),
  issueTokens: jest.fn(),
  refreshTokens: jest.fn(),
  revokeRefreshToken: jest.fn(),
};

// Sets req.user so @CurrentUser() works in protected routes
const mockJwtGuard = {
  canActivate: jest.fn().mockImplementation((ctx) => {
    ctx.switchToHttp().getRequest().user = { id: 'user-1', type: 'client' };
    return true;
  }),
};

describe('ClientAuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAuthController],
      providers: [
        { provide: AuthService, useValue: authMock },
        prismaMockProvider,
      ],
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

  // ─── POST /v1/client/auth/otp/request ──────────────────────────────────────

  describe('POST /v1/client/auth/otp/request', () => {
    it('returns 201 with message and expiresInSeconds', async () => {
      prismaMock.user.upsert.mockResolvedValue({ id: 'user-1' });
      authMock.generateOtp.mockResolvedValue('123456');

      const res = await request(app.getHttpServer())
        .post('/v1/client/auth/otp/request')
        .send({ phone: '+94771234567' })
        .expect(201);

      expect(res.body).toMatchObject({ message: 'OTP sent', expiresInSeconds: 300 });
    });

    it('returns 401 when neither email nor phone provided', async () => {
      await request(app.getHttpServer())
        .post('/v1/client/auth/otp/request')
        .send({})
        .expect(401);
    });
  });

  // ─── POST /v1/client/auth/otp/verify ───────────────────────────────────────

  describe('POST /v1/client/auth/otp/verify', () => {
    it('returns 201 with tokens and isNewUser=true for new user', async () => {
      authMock.verifyOtp.mockResolvedValue(true);
      prismaMock.user.findFirst.mockResolvedValue({ id: 'user-1', fullName: null });
      authMock.issueTokens.mockResolvedValue({
        accessToken: 'acc',
        refreshToken: 'ref',
        expiresIn: 900,
      });

      const res = await request(app.getHttpServer())
        .post('/v1/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '123456' })
        .expect(201);

      expect(res.body).toMatchObject({ accessToken: 'acc', isNewUser: true });
    });

    it('returns 201 with isNewUser=false for returning user', async () => {
      authMock.verifyOtp.mockResolvedValue(true);
      prismaMock.user.findFirst.mockResolvedValue({ id: 'user-1', fullName: 'Kasun Perera' });
      authMock.issueTokens.mockResolvedValue({
        accessToken: 'acc',
        refreshToken: 'ref',
        expiresIn: 900,
      });

      const res = await request(app.getHttpServer())
        .post('/v1/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '123456' })
        .expect(201);

      expect(res.body.isNewUser).toBe(false);
    });

    it('returns 401 for invalid OTP code', async () => {
      authMock.verifyOtp.mockResolvedValue(false);

      await request(app.getHttpServer())
        .post('/v1/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '000000' })
        .expect(401);
    });

    it('returns 400 when code is not 6 digits', async () => {
      await request(app.getHttpServer())
        .post('/v1/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '12' })
        .expect(400);
    });
  });

  // ─── POST /v1/client/auth/register ─────────────────────────────────────────

  describe('POST /v1/client/auth/register', () => {
    const validBody = {
      fullName: 'Kasun Perera',
      nic: '199512345678',
      province: 'Western',
      district: 'Colombo',
      city: 'Colombo 1',
      streetAddress: 'No. 45, Galle Road',
    };

    it('returns 201 with updated user when authenticated', async () => {
      prismaMock.user.update.mockResolvedValue({ id: 'user-1', fullName: 'Kasun Perera' });

      const res = await request(app.getHttpServer())
        .post('/v1/client/auth/register')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send(validBody)
        .expect(201);

      expect(res.body).toMatchObject({ fullName: 'Kasun Perera' });
    });

    it('returns 403 when guard blocks the request', async () => {
      mockJwtGuard.canActivate.mockReturnValueOnce(false);

      await request(app.getHttpServer())
        .post('/v1/client/auth/register')
        .send(validBody)
        .expect(403);
    });

    it('returns 400 when fullName is missing', async () => {
      const { fullName: _, ...body } = validBody;
      await request(app.getHttpServer())
        .post('/v1/client/auth/register')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send(body)
        .expect(400);
    });

    it('returns 400 when NIC format is invalid', async () => {
      await request(app.getHttpServer())
        .post('/v1/client/auth/register')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send({ ...validBody, nic: 'BADNIC' })
        .expect(400);
    });
  });

  // ─── POST /v1/client/auth/refresh ──────────────────────────────────────────

  describe('POST /v1/client/auth/refresh', () => {
    it('returns 201 with new tokens', async () => {
      authMock.refreshTokens.mockResolvedValue({
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
        expiresIn: 900,
      });

      const res = await request(app.getHttpServer())
        .post('/v1/client/auth/refresh')
        .send({ refreshToken: 'old-token' })
        .expect(201);

      expect(res.body).toMatchObject({ accessToken: 'new-acc' });
    });

    it('returns 401 when refresh token is invalid', async () => {
      authMock.refreshTokens.mockRejectedValue(new UnauthorizedException());

      await request(app.getHttpServer())
        .post('/v1/client/auth/refresh')
        .send({ refreshToken: 'bad-token' })
        .expect(401);
    });
  });

  // ─── POST /v1/client/auth/logout ───────────────────────────────────────────

  describe('POST /v1/client/auth/logout', () => {
    it('returns 200 and revokes token when authenticated', async () => {
      authMock.revokeRefreshToken.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .post('/v1/client/auth/logout')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send({ refreshToken: 'some-token' })
        .expect(200);

      expect(authMock.revokeRefreshToken).toHaveBeenCalledWith('some-token');
    });
  });
});
