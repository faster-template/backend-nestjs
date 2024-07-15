import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { CryptoUtil } from 'src/utils/crypto.util';
import {
  WechatException,
  AuthDisableException,
  AuthValidFailException,
} from '@/exception/custom-exception';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  WechatAuthService,
  isWechatOAuthFailure,
} from '../wechat-auth/wechat-auth.service';
import { ITokenResult, IPayload } from './user-auth.interface';
import { VerifyCodeService } from '../verify-code/verify-code.service';
import { EVerifyCodeType } from '../verify-code/verify-code.enum';
@Injectable()
export class UserAuthService {
  constructor(
    private usersService: UserService,
    private wechatAuthService: WechatAuthService,
    private verifyCodeService: VerifyCodeService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginByPassword(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOneByUserName(username);
    if (
      user &&
      CryptoUtil.compare(password, user.password, user.passwordSalt, true)
    ) {
      // 检查用户状态
      if (this.usersService.IsEnable(user)) {
        return user;
      } else {
        throw new AuthDisableException();
      }
    }
    return null;
  }
  async loginByPhone(
    phone: string,
    code: string,
    registerWhenNotExist: boolean = true,
  ): Promise<UserEntity | null> {
    const valid = await this.verifyCodeService.verify({
      phone,
      type: EVerifyCodeType.LOGIN,
      code,
    });
    if (valid) {
      const user = await this.usersService.findOneByPhone(phone);
      if (user) {
        // 检查用户状态
        if (this.usersService.IsEnable(user)) {
          return user;
        } else {
          throw new AuthDisableException();
        }
      } else if (registerWhenNotExist) {
        return await this.usersService.createUserByPhone(phone);
      } else {
        throw new AuthValidFailException();
      }
    }
    return null;
  }
  async loginByWechat(code: string, registerWhenNotExist: boolean = true) {
    const result = await this.wechatAuthService.getWechatOAuth(code);
    if (isWechatOAuthFailure(result)) {
      throw new WechatException(result);
    } else {
      const { openid, unionid } = result;
      const user = await this.usersService.findOneByWechat({
        openid,
        unionid,
      });
      if (user) {
        if (this.usersService.IsEnable(user)) {
          return user;
        } else {
          throw new AuthDisableException();
        }
      } else if (registerWhenNotExist) {
        return await this.usersService.createUserByWechat(openid, unionid);
      } else {
        throw new AuthValidFailException();
      }
    }
  }

  async registerByPassword(username: string, password: string): Promise<any> {
    const user = await this.usersService.createUserByPassword(
      username,
      password,
    );
    return user;
  }

  // 生成JWTToken
  async generateToken(
    user: UserEntity,
    withRoles: boolean = false,
  ): Promise<ITokenResult> {
    const payload: IPayload = {
      id: user.id,
      roles: [],
    };
    if (withRoles && user.roles) {
      payload.roles = user.roles.map((role) => role.roleType);
    }
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
}
