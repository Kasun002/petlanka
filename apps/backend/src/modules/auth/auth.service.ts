import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthTokens, JwtPayload, RoleName } from '@petlanka/types';

const OTP_TTL_MS = 5 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 10;

type OtpIdentifier = { phone?: string; email?: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async generateOtp(userId: string): Promise<string> {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const hash = await bcrypt.hash(code, BCRYPT_ROUNDS);
    await this.prisma.otpCode.create({
      data: {
        userId,
        code: hash,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    });
    return code;
  }

  async verifyOtp(identifier: OtpIdentifier, code: string): Promise<boolean> {
    const where = identifier.phone
      ? { user: { phone: identifier.phone } }
      : { user: { email: identifier.email } };

    const otp = await this.prisma.otpCode.findFirst({
      where: { ...where, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) return false;
    if (otp.usedAt || otp.expiresAt < new Date()) return false;
    if (!(await bcrypt.compare(code, otp.code))) return false;

    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });
    return true;
  }

  async issueTokens(
    sub: string,
    type: 'client' | 'admin',
    role?: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub, type, role: role as RoleName | undefined };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    const tokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        ...(type === 'client' ? { userId: sub } : { adminId: sub }),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }

  async refreshTokens(rawToken: string): Promise<AuthTokens> {
    // ponytail: findFirst assumes one active refresh token per user/device.
    // upgrade path: add `jti` UUID column, embed in JWT, query by jti for O(1) multi-device support.
    const record = await this.prisma.refreshToken.findFirst({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!record || !(await bcrypt.compare(rawToken, record.token))) {
      throw new UnauthorizedException();
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const type: 'client' | 'admin' = record.adminId ? 'admin' : 'client';
    return this.issueTokens((record.userId ?? record.adminId) as string, type);
  }

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const record = await this.prisma.refreshToken.findFirst({
      where: { revokedAt: null },
    });
    if (!record) return;

    if (await bcrypt.compare(rawToken, record.token)) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string; firstName: string; lastName: string; role: string } | null> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) return null;
    return (await bcrypt.compare(password, admin.passwordHash)) ? admin : null;
  }

}
