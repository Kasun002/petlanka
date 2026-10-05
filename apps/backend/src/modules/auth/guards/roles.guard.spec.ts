import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RoleName } from '@petlanka/types';

const makeCtx = (user: object) =>
  ({
    getHandler: jest.fn(),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { get: jest.Mock };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: { get: jest.fn() } }],
    }).compile();
    guard = module.get(RolesGuard);
    reflector = module.get(Reflector);
  });

  it('allows access when no @Roles decorator is set', () => {
    reflector.get.mockReturnValue(undefined);
    expect(guard.canActivate(makeCtx({}))).toBe(true);
  });

  it('allows an admin with a matching role', () => {
    reflector.get.mockReturnValue([RoleName.SUPER_ADMIN, RoleName.ADMIN]);
    expect(
      guard.canActivate(makeCtx({ type: 'admin', role: RoleName.SUPER_ADMIN })),
    ).toBe(true);
  });

  it('blocks an admin whose role is not in the required list', () => {
    reflector.get.mockReturnValue([RoleName.SUPER_ADMIN, RoleName.ADMIN]);
    expect(
      guard.canActivate(makeCtx({ type: 'admin', role: RoleName.MODERATOR })),
    ).toBe(false);
  });

  it('blocks a client token regardless of roles list', () => {
    reflector.get.mockReturnValue([RoleName.ADMIN]);
    expect(guard.canActivate(makeCtx({ type: 'client' }))).toBe(false);
  });
});
