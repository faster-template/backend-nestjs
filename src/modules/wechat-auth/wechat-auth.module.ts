import { Module } from '@nestjs/common';
import { WechatAuthController } from './wechat-auth.controller';
import { WechatAuthService } from './wechat-auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WechatAuthController],
  providers: [WechatAuthService],
  exports: [WechatAuthService],
})
export class WechatAuthModule {}
