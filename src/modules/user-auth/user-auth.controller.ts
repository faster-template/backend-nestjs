import { Request, Controller, Post, UseGuards } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { PhoneAuthGuard } from '@/guards/passport-guards/phone.guard';
import { WechatAuthGuard } from '@/guards/passport-guards/wechat.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthNotRequire } from './user-auth.decorator';

@Controller('user-auth')
// 这里是一些登录、注册、退出等接口的实现
export class UserAuthController {
  constructor(private authService: UserAuthService) {}

  @AuthNotRequire()
  @UseGuards(WechatAuthGuard)
  @Post('login-wechat')
  async loginByWechat(@Request() req) {
    return this.authService.generateToken(req.user, false);
  }

  @AuthNotRequire()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginByLocal(@Request() req) {
    return this.authService.generateToken(req.user, false);
  }

  @AuthNotRequire()
  @UseGuards(PhoneAuthGuard)
  @Post('login-phone')
  async loginByPhone(@Request() req) {
    return this.authService.generateToken(req.user, false);
  }
}
