import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  IWechatOAuthFailure,
  IWechatOAuthSuccess,
} from './wechat-auth.interface';

export function isWechatOAuthFailure(
  response: any,
): response is IWechatOAuthFailure {
  return (response as IWechatOAuthFailure).errcode !== undefined;
}

@Injectable()
export class WechatAuthService {
  constructor(private readonly httpService: HttpService) {}
  getAuthUrl(
    redirectUrl: string,
    state: string,
    scope: string = 'snsapi_userinfo',
  ): string {
    const appId = process.env.WECHAT_APP_ID;
    const url = new URL('https://open.weixin.qq.com/connect/oauth2/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('appid', appId);
    url.searchParams.set('redirect_uri', redirectUrl);
    url.searchParams.set('scope', scope);
    state && url.searchParams.set('state', state);
    url.hash = 'wechat_redirect';
    return url.href;
  }

  async getWechatOAuth(
    code: string,
  ): Promise<IWechatOAuthSuccess | IWechatOAuthFailure> {
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;
    const url = new URL('https://api.weixin.qq.com/sns/oauth2/access_token');
    url.searchParams.set('grant_type', 'authorization_code');
    url.searchParams.set('appid', appId);
    url.searchParams.set('secret', appSecret);
    url.searchParams.set('code', code);
    const observe = this.httpService.get(url.href);
    const res = await lastValueFrom(observe);
    return res.data;
  }
}
