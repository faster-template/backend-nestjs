import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ExceptionHandler } from '@/exception/exception.strategy';
import { IResponseData } from '@/interceptors/response.interface';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'catch - exception:',
        exception,
        exception.constructor.toString(),
      );
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const customException = ExceptionHandler.handle(exception);
    const { code, message } = customException;
    const responseData: IResponseData = {
      code,
      message,
      success: false,
    };
    const request = ctx.getRequest();

    // 记录日志
    this.logger.error(
      `${request.method} ${request.url} -${customException.getStatus()}- ${JSON.stringify(responseData.message)}`,
      { context: exception },
    );
    // 统一返回错误格式
    response.code(200).send(responseData);
  }
}
