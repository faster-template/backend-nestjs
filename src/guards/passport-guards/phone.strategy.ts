import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable } from '@nestjs/common';
import { AuthValidFailException } from '@/exception/custom-exception';
import { UserAuthService } from '@/modules/user-auth/user-auth.service';
@Injectable()
export class PhoneStrategy extends PassportStrategy(Strategy, 'phone') {
  constructor(private authService: UserAuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const { phone, code } = req.query;
    const user = await this.authService.loginByPhone(phone, code);
    if (!user) {
      throw new AuthValidFailException();
    }
    return user;
  }
}
