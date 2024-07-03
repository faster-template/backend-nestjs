import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IPayload } from '@/modules/user-auth/user-auth.interface';
import { EUserRole } from '@/modules/user-role/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: IPayload) {
    return {
      ...payload,
      isAdmin: [EUserRole.Admin, EUserRole.SuperAdmin].some((t) =>
        payload.roles.includes(t),
      ),
    };
  }
}
