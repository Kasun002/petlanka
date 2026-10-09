import { JwtService } from '@nestjs/jwt';

export const jwtMock = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn(),
  decode: jest.fn(),
  signAsync: jest.fn().mockResolvedValue('mock.jwt.token'),
  verifyAsync: jest.fn(),
};

export const jwtMockProvider = {
  provide: JwtService,
  useValue: jwtMock as unknown as JwtService,
};
