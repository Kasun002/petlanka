import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { AdminHealthController } from './admin-health.controller';
import { PrismaService } from '../../../prisma/prisma.service';

describe('AdminHealthController', () => {
  let controller: AdminHealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [AdminHealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]) },
        },
      ],
    }).compile();

    controller = module.get<AdminHealthController>(AdminHealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
