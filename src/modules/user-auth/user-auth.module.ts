import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/guards/passport-guards/jwt.strategy';
import { LocalStrategy } from '@/guards/passport-guards/local.strategy';
import { PhoneStrategy } from '@/guards/passport-guards/phone.strategy';
import { WechatStrategy } from '@/guards/passport-guards/wechat.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WechatAuthModule } from '../wechat-auth/wechat-auth.module';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserModule } from '../user/user.module';
import { VerifyCodeModule } from '../verify-code/verify-code.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    WechatAuthModule,
    PassportModule,
    UserRoleModule,
    VerifyCodeModule,
  ],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,
    JwtService,
    JwtStrategy,
    LocalStrategy,
    WechatStrategy,
    PhoneStrategy,
  ],
  exports: [UserAuthService, JwtService],
})
export class UserAuthModule {}
