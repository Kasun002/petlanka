import { Module } from '@nestjs/common';
import { AdminHealthModule } from './health/admin-health.module';

@Module({
  imports: [AdminHealthModule],
})
export class AdminModule {}
