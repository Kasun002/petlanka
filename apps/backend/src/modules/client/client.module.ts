import { Module } from '@nestjs/common';
import { ClientHealthModule } from './health/client-health.module';
import { ClientAuthController } from './auth/client-auth.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ClientHealthModule, AuthModule],
  controllers: [ClientAuthController],
})
export class ClientModule {}
