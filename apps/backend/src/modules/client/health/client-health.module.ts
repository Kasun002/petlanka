import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ClientHealthController } from './client-health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [ClientHealthController],
})
export class ClientHealthModule {}
