import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { prismaMock, prismaMockProvider } from '../../test/prisma-mock';
import { jwtMock, jwtMockProvider } from '../../test/jwt-mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, prismaMockProvider, jwtMockProvider],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ─── generateOtp ───────────────────────────────────────────────────────────

  describe('generateOtp', () => {
    it('returns a 6-digit numeric string', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      const code = await service.generateOtp('user-1');
      expect(code).toMatch(/^\d{6}$/);
    });

    it('stores a bcrypt hash, not plaintext', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      const code = await service.generateOtp('user-1');
      const stored: string = prismaMock.otpCode.create.mock.calls[0][0].data.code;
      expect(stored).not.toBe(code);
      expect(await bcrypt.compare(code, stored)).toBe(true);
    });

    it('sets expiresAt ~5 minutes from now', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      const before = Date.now();
      await service.generateOtp('user-1');
      const expiresAt: Date = prismaMock.otpCode.create.mock.calls[0][0].data.expiresAt;
      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + 4 * 60 * 1000);
      expect(expiresAt.getTime()).toBeLessThanOrEqual(before + 6 * 60 * 1000);
    });

    it('links OTP to the given userId', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      await service.generateOtp('user-42');
      expect(prismaMock.otpCode.create.mock.calls[0][0].data.userId).toBe('user-42');
    });
  });

  // ─── verifyOtp ─────────────────────────────────────────────────────────────

  describe('verifyOtp', () => {
    const makeOtp = (overrides: object = {}) => ({
      id: 'otp-1',
      code: bcrypt.hashSync('123456', 10),
      expiresAt: new Date(Date.now() + 60_000),
      usedAt: null,
      ...overrides,
    });

    it('returns true and marks OTP used for a valid code', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(makeOtp());
      prismaMock.otpCode.update.mockResolvedValue({});
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(true);
      expect(prismaMock.otpCode.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'otp-1' } }),
      );
    });

    it('returns false for wrong code', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(makeOtp());
      const result = await service.verifyOtp({ phone: '+94771234567' }, '000000');
      expect(result).toBe(false);
      expect(prismaMock.otpCode.update).not.toHaveBeenCalled();
    });

    it('returns false for expired OTP', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(
        makeOtp({ expiresAt: new Date(Date.now() - 1000) }),
      );
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(false);
    });

    it('returns false for already-used OTP', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(makeOtp({ usedAt: new Date() }));
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(false);
    });

    it('returns false when no OTP record found', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(null);
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(false);
    });

    it('resolves OTP by email when phone is not provided', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(makeOtp());
      prismaMock.otpCode.update.mockResolvedValue({});
      const result = await service.verifyOtp({ email: 'user@petlanka.lk' }, '123456');
      expect(result).toBe(true);
    });
  });

  // ─── issueTokens ───────────────────────────────────────────────────────────

  describe('issueTokens', () => {
    it('returns accessToken and refreshToken strings', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      const tokens = await service.issueTokens('user-1', 'client');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    it('stores a bcrypt hash of the refresh token, not plaintext', async () => {
      jwtMock.sign
        .mockReturnValueOnce('access.token')
        .mockReturnValueOnce('refresh.token');
      prismaMock.refreshToken.create.mockResolvedValue({});
      const tokens = await service.issueTokens('user-1', 'client');
      const storedHash: string = prismaMock.refreshToken.create.mock.calls[0][0].data.token;
      expect(storedHash).not.toBe(tokens.refreshToken);
      expect(await bcrypt.compare(tokens.refreshToken, storedHash)).toBe(true);
    });

    it('sets userId for client tokens', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      await service.issueTokens('user-1', 'client');
      const data = prismaMock.refreshToken.create.mock.calls[0][0].data;
      expect(data.userId).toBe('user-1');
      expect(data.adminId).toBeUndefined();
    });

    it('sets adminId for admin tokens', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      await service.issueTokens('admin-1', 'admin', 'SUPER_ADMIN');
      const data = prismaMock.refreshToken.create.mock.calls[0][0].data;
      expect(data.adminId).toBe('admin-1');
      expect(data.userId).toBeUndefined();
    });

    it('includes role in JWT payload for admin tokens', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      await service.issueTokens('admin-1', 'admin', 'SUPER_ADMIN');
      const accessPayload = jwtMock.sign.mock.calls[0][0];
      expect(accessPayload).toMatchObject({ type: 'admin', role: 'SUPER_ADMIN' });
    });

    it('does not include role for client tokens', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      await service.issueTokens('user-1', 'client');
      const accessPayload = jwtMock.sign.mock.calls[0][0];
      expect(accessPayload.role).toBeUndefined();
    });
  });

  // ─── refreshTokens ─────────────────────────────────────────────────────────

  describe('refreshTokens', () => {
    const makeStoredToken = (overrides: object = {}) => ({
      id: 'rt-1',
      token: bcrypt.hashSync('old-token', 10),
      userId: 'user-1',
      adminId: null,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      ...overrides,
    });

    it('issues new tokens and revokes the old refresh token', async () => {
      prismaMock.refreshToken.findFirst.mockResolvedValue(makeStoredToken());
      prismaMock.refreshToken.update.mockResolvedValue({});
      prismaMock.refreshToken.create.mockResolvedValue({});

      const tokens = await service.refreshTokens('old-token');
      expect(typeof tokens.accessToken).toBe('string');
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'rt-1' } }),
      );
    });

    // DB WHERE filters expired/revoked tokens — findFirst returns null for those cases
    it('throws UnauthorizedException when DB returns no active token (expired/revoked/missing)', async () => {
      prismaMock.refreshToken.findFirst.mockResolvedValue(null);
      await expect(service.refreshTokens('any-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when token hash does not match', async () => {
      prismaMock.refreshToken.findFirst.mockResolvedValue(makeStoredToken());
      await expect(service.refreshTokens('wrong-token')).rejects.toThrow(UnauthorizedException);
    });

    it('issues tokens as admin type when record has adminId', async () => {
      prismaMock.refreshToken.findFirst.mockResolvedValue(
        makeStoredToken({ userId: null, adminId: 'admin-1' }),
      );
      prismaMock.refreshToken.update.mockResolvedValue({});
      prismaMock.refreshToken.create.mockResolvedValue({});
      const tokens = await service.refreshTokens('old-token');
      expect(typeof tokens.accessToken).toBe('string');
      const payload = jwtMock.sign.mock.calls[0][0];
      expect(payload.type).toBe('admin');
      expect(payload.sub).toBe('admin-1');
    });
  });

  // ─── revokeRefreshToken ────────────────────────────────────────────────────

  describe('revokeRefreshToken', () => {
    it('sets revokedAt on the matching token record', async () => {
      prismaMock.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1',
        token: bcrypt.hashSync('my-token', 10),
      });
      prismaMock.refreshToken.update.mockResolvedValue({});
      await service.revokeRefreshToken('my-token');
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'rt-1' },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        }),
      );
    });

    it('resolves silently when token is not found', async () => {
      prismaMock.refreshToken.findFirst.mockResolvedValue(null);
      await expect(service.revokeRefreshToken('ghost-token')).resolves.toBeUndefined();
    });
  });

  // ─── validateAdmin ─────────────────────────────────────────────────────────

  describe('validateAdmin', () => {
    const passwordHash = bcrypt.hashSync('correct-pass', 10);
    const makeAdmin = (overrides: object = {}) => ({
      id: 'admin-1',
      email: 'admin@petlanka.lk',
      passwordHash,
      isActive: true,
      role: 'SUPER_ADMIN',
      ...overrides,
    });

    it('returns admin object on valid credentials', async () => {
      prismaMock.admin.findUnique.mockResolvedValue(makeAdmin());
      const result = await service.validateAdmin('admin@petlanka.lk', 'correct-pass');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('admin-1');
    });

    it('returns null for wrong password', async () => {
      prismaMock.admin.findUnique.mockResolvedValue(makeAdmin());
      const result = await service.validateAdmin('admin@petlanka.lk', 'wrong-pass');
      expect(result).toBeNull();
    });

    it('returns null for non-existent email', async () => {
      prismaMock.admin.findUnique.mockResolvedValue(null);
      const result = await service.validateAdmin('nobody@petlanka.lk', 'any');
      expect(result).toBeNull();
    });

    it('returns null for inactive admin', async () => {
      prismaMock.admin.findUnique.mockResolvedValue(makeAdmin({ isActive: false }));
      const result = await service.validateAdmin('admin@petlanka.lk', 'correct-pass');
      expect(result).toBeNull();
    });
  });
});
