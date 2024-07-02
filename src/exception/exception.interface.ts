import { HttpStatus } from '@nestjs/common';
import { EErrorCode } from './exception.enum';

export interface ICustomException {
  message: string; // 错误消息
  code?: EErrorCode; // 错误代码，用于程序差错
  manual?: boolean; // 是否手动抛出错误
  status?: HttpStatus; // http状态码
  data?: any; // 错误消息的负载数据
}
