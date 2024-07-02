import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable } from '@nestjs/common';
import { UserAuthService } from '@/modules/user-auth/user-auth.service';
import { CustomException, WechatException } from '@/exception/custom-exception';

@Injectable()
export class WechatStrategy extends PassportStrategy(Strategy, 'wechat') {
  constructor(private authService: UserAuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const { code } = req.body;
    if (code) {
      const user = await this.authService.loginByWechat(code);
      if (!user) {
        throw new WechatException({ errcode: 401, errmsg: '验证code时失败' });
      }
      return user;
    }
    throw new CustomException({ message: '缺少code' });
  }
}
