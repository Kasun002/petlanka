import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { ClientHealthController } from './client-health.controller';
import { PrismaService } from '../../../prisma/prisma.service';

describe('ClientHealthController', () => {
  let controller: ClientHealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [ClientHealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]) },
        },
      ],
    }).compile();

    controller = module.get<ClientHealthController>(ClientHealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
