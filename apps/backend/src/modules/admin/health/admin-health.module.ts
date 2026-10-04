import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AdminHealthController } from './admin-health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [AdminHealthController],
})
export class AdminHealthModule {}
