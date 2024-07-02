export enum EErrorCode {
  // 客户端来源错误 1000+
  CLIENT_ERROR = 1001,
  // 服务器错误 2000+
  SERVER_ERROR = 2001,
  // token相关错误 3000+
  AUTH_ERROR = 3001,
  AUTH_LOGIN_FAIL = 3002,
  AUTH_LOGIN_DISABLE = 3003,
  // 微信的错 4000+
  WECHAT_AUTH_FAILURE = 4001,
}
