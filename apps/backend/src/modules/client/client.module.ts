import { Module } from '@nestjs/common';
import { ClientHealthModule } from './health/client-health.module';

@Module({
  imports: [ClientHealthModule],
})
export class ClientModule {}
