import { PrismaService } from '../prisma/prisma.service';

// Plain object mock — cast to PrismaService avoids satisfies-type-check complexity
// while still giving tests a typed handle to configure mocks.
const mock = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
  admin: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  otpCode: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

// $transaction added separately to avoid circular self-reference TS error
export const prismaMock = Object.assign(mock, {
  $transaction: jest.fn((cb: (p: typeof mock) => unknown) => cb(mock)),
});

export const prismaMockProvider = {
  provide: PrismaService,
  useValue: prismaMock as unknown as PrismaService,
};
