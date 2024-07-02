import { SetMetadata } from '@nestjs/common';
// 无需认证，用于跳过JWT认证
export const AUTH_NOT_REQUIRE_KEY = 'AuthNotRequire';
export const AuthNotRequire = () => SetMetadata(AUTH_NOT_REQUIRE_KEY, true);
