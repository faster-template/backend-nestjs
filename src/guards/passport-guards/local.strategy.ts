import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthValidFailException } from '@/exception/custom-exception';
import { UserAuthService } from '@/modules/user-auth/user-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: UserAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.loginByPassword(username, password);
    if (!user) {
      throw new AuthValidFailException();
    }
    return user;
  }
}
