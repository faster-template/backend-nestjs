import { EUserRole } from '@/modules/user-role/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
