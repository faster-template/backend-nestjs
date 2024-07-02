import {
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from './custom-exception';
import { EErrorCode } from './exception.enum';
import { FastifyError } from 'fastify';
import { TypeORMError } from 'typeorm';

interface ExceptionStrategy {
  handle(exception: any): CustomException;
}

class UnauthorizedExceptionStrategy implements ExceptionStrategy {
  handle(exception: UnauthorizedException): CustomException {
    const customException = new CustomException({
      message: exception.message,
      code: EErrorCode.AUTH_ERROR,
    });
    return customException;
  }
}

class BadRequestExceptionStrategy implements ExceptionStrategy {
  handle(exception: BadRequestException): CustomException {
    const rep = exception.getResponse() as object;
    const customException = new CustomException({
      message: Array.isArray(rep?.['message'])
        ? rep?.['message']?.[0]
        : '请求参数错误，请检查后重试',
      code: EErrorCode.CLIENT_ERROR,
    });
    return customException;
  }
}
class FastifyExceptionStrategy implements ExceptionStrategy {
  handle(exception: FastifyError): CustomException {
    const customException = new CustomException({
      message: '服务器开小差了',
      code: EErrorCode.SERVER_ERROR,
      status: exception.statusCode,
    });
    switch (exception.code) {
      case 'FST_REQ_FILE_TOO_LARGE':
        customException.message = '文件大小超过限制';
        break;
      case 'FST_PARTS_LIMIT':
      case 'FST_FILES_LIMIT':
      case 'FST_FIELDS_LIMIT':
        customException.message = '文件上传表单超过限制';
        break;
      case 'FST_NO_FORM_DATA':
      case 'FST_FILE_BUFFER_NOT_FOUND':
        customException.message = '文件内容不存在';
        break;
      case 'FST_INVALID_MULTIPART_CONTENT_TYPE':
      case 'FST_INVALID_JSON_FIELD_ERROR':
        customException.message = '文件格式错误';
        break;
      case 'FST_CSRF_MISSING_SECRET':
        customException.message = '用户认证失败，请重试';
        customException.code = EErrorCode.AUTH_ERROR;
        break;

      default:
        customException.message = '服务器开小差了';
        break;
    }

    return customException;
  }
}

class TypeOrmExceptionStrategy implements ExceptionStrategy {
  handle(): CustomException {
    const customException = new CustomException({
      message: '服务器开小差了，请刷新重试',
      code: EErrorCode.SERVER_ERROR,
    });
    return customException;
  }
}

export class ExceptionHandler {
  private static strategies: Record<string, ExceptionStrategy> = {
    UnauthorizedException: new UnauthorizedExceptionStrategy(),
    BadRequestException: new BadRequestExceptionStrategy(),
    FastifyError: new FastifyExceptionStrategy(),
    QueryFailedError: new TypeOrmExceptionStrategy(),
  };

  static handle(exception: any): CustomException {
    if (exception instanceof CustomException) return exception;

    const strategy = this.strategies[exception.constructor.name];
    if (strategy) {
      return strategy.handle(exception);
    }
    return new CustomException({
      message: exception.message || '服务器开小差了',
      code: EErrorCode.SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      manual: false,
    });
  }
}
