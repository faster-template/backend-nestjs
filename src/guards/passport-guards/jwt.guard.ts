import { AUTH_NOT_REQUIRE_KEY } from '@/modules/user-auth/user-auth.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    const authNotRequire = this.reflector.getAllAndOverride<boolean>(
      AUTH_NOT_REQUIRE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (authNotRequire) {
      return true;
    }
    return super.canActivate(context);
  }
}
