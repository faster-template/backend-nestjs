import { Controller, Get, Query } from '@nestjs/common';
import { WechatAuthService } from './wechat-auth.service';
import { CustomException } from '@/exception/custom-exception';
import { EErrorCode } from '@/exception/exception.enum';
import { AuthNotRequire } from '../user-auth/user-auth.decorator';

@Controller('wechat-auth')
export class WechatAuthController {
  constructor(private readonly wechatAuthService: WechatAuthService) {}

  @AuthNotRequire()
  @Get('getAuthUrl')
  getAuthUrl(
    @Query('scope') scope,
    @Query('redirectUrl') redirectUrl,
    @Query('state') state,
  ): string {
    if (redirectUrl) {
      const wxAuthUrl = this.wechatAuthService.getAuthUrl(
        redirectUrl,
        state,
        scope,
      );

      return wxAuthUrl;
    } else {
      throw new CustomException({
        message: '需要传入redirectUrl',
        code: EErrorCode.CLIENT_ERROR,
        manual: true, // 手动抛出错误
      });
    }
  }
}
