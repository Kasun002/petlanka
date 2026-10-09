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
import { AdminLoginResponse, AuthTokens } from '@petlanka/types';
import { AdminLoginDto } from './dto/admin-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller({ path: 'admin/auth', version: '1' })
export class AdminAuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: AdminLoginDto): Promise<AdminLoginResponse> {
    const admin = await this.auth.validateAdmin(dto.email, dto.password);
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.auth.issueTokens(admin.id, 'admin', admin.role);
    return {
      ...tokens,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role as AdminLoginResponse['admin']['role'],
      },
    };
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
