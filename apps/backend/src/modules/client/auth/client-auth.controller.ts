import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  AuthTokens,
  AuthenticatedUser,
  OtpRequestResponse,
  OtpVerifyResponse,
} from '@petlanka/types';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Controller({ path: 'client/auth', version: '1' })
export class ClientAuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('otp/request')
  async requestOtp(@Body() dto: RequestOtpDto): Promise<OtpRequestResponse> {
    if (!dto.email && !dto.phone) {
      throw new UnauthorizedException('email or phone required');
    }

    const where = dto.phone ? { phone: dto.phone } : { email: dto.email };
    const user = await this.prisma.user.upsert({
      where,
      create: where,
      update: {},
    });

    const code = await this.auth.generateOtp(user.id);
    // ponytail: OTP delivery via console.log — replace with SMS/email provider
    console.log(`[OTP] ${dto.phone ?? dto.email}: ${code}`);

    return { message: 'OTP sent', expiresInSeconds: 300 };
  }

  @Post('otp/verify')
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<OtpVerifyResponse> {
    const valid = await this.auth.verifyOtp(dto, dto.code);
    if (!valid) throw new UnauthorizedException('Invalid or expired OTP');

    const where = dto.phone ? { phone: dto.phone } : { email: dto.email };
    const user = await this.prisma.user.findFirst({ where });
    if (!user) throw new UnauthorizedException();

    const tokens = await this.auth.issueTokens(user.id, 'client');
    return { ...tokens, isNewUser: !user.firstName };
  }

  @Post('register')
  @UseGuards(JwtGuard)
  async register(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterClientDto,
  ): Promise<{ id: string; firstName: string | null; lastName: string | null }> {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { firstName: dto.firstName, lastName: dto.lastName, isVerified: true },
      select: { id: true, firstName: true, lastName: true },
    });
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokens> {
    return this.auth.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.auth.revokeRefreshToken(dto.refreshToken);
  }
}
