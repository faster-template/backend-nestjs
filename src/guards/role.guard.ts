import { AUTH_NOT_REQUIRE_KEY } from '@/modules/user-auth/user-auth.decorator';
import { IPayload } from '@/modules/user-auth/user-auth.interface';
import { ROLES_KEY } from '@/modules/user-role/user-role.decorator';
import { EUserRole } from '@/modules/user-role/user-role.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const AuthNotRequire = this.reflector.getAllAndOverride<boolean>(
      AUTH_NOT_REQUIRE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length < 1 || AuthNotRequire) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new ForbiddenException();
    }
    const { roles } = req.user as IPayload;
    if (!roles || !roles.some((roleType) => requiredRoles.includes(roleType))) {
      throw new ForbiddenException();
    } else {
      return true;
    }
  }
}
