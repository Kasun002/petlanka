import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser, RoleName } from '@petlanka/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<RoleName[]>('roles', ctx.getHandler());
    if (!required?.length) return true;
    const user = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>().user;
    return user?.type === 'admin' && required.includes(user.role!);
  }
}
