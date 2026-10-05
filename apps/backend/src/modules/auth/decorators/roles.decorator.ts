import { SetMetadata } from '@nestjs/common';
import { RoleName } from '@petlanka/types';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
