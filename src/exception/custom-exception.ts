import { HttpException, HttpStatus } from '@nestjs/common';
import { ICustomException } from './exception.interface';
import { EErrorCode } from './exception.enum';
import { IWechatOAuthFailure } from '@/modules/wechat-auth/wechat-auth.interface';

// 自定义异常消息
export class CustomException extends HttpException {
  message: string = '';
  data?: any;
  code: EErrorCode = EErrorCode.SERVER_ERROR;
  manual: boolean = true; // 手动抛出异常
  constructor(exception: ICustomException | string) {
    super(
      exception,
      typeof exception === 'string'
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : exception.status,
    );
    if (typeof exception === 'string') {
      this.message = exception;
    } else {
      this.message = exception.message || '';
      this.data = exception.data || null;
      this.code = exception.code || EErrorCode.SERVER_ERROR;
      this.manual = exception.manual || true;
    }
  }
}

export class CustomManualException extends CustomException {
  constructor(exception: ICustomException) {
    const { message, data, code, status } = exception;
    super({
      message,
      data,
      code,
      status,
      manual: true,
    });
  }
}

export class WechatException extends CustomException {
  constructor(wechatError: IWechatOAuthFailure) {
    // 这里会根据微信授权失败的原因，返回适应的错误信息
    super({
      message: '微信授权失败，请检查是否已关注公众号',
      code: EErrorCode.WECHAT_AUTH_FAILURE,
      data: wechatError,
    });
  }
}

export class AuthException extends CustomException {
  constructor() {
    super({
      message: '未登录或登录已失效',
      code: EErrorCode.AUTH_ERROR,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class AuthValidFailException extends CustomException {
  constructor() {
    super({
      message: '登录验证失败，请检查',
      code: EErrorCode.AUTH_LOGIN_FAIL,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class AuthDisableException extends CustomException {
  constructor() {
    super({
      message: '用户已被禁用',
      code: EErrorCode.AUTH_LOGIN_DISABLE,
      status: HttpStatus.FORBIDDEN,
    });
  }
}
