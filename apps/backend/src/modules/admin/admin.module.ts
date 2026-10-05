import { Module } from '@nestjs/common';
import { AdminHealthModule } from './health/admin-health.module';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AdminHealthModule, AuthModule],
  controllers: [AdminAuthController],
})
export class AdminModule {}
