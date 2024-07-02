export interface IWechatOAuthSuccess {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  is_snapshotuser: number;
  unionid: string;
}

export interface IWechatOAuthFailure {
  errcode: number;
  errmsg: string;
}

export interface IWechatUserBaseAuthInfo {
  openid: string;
  unionid: string;
}
