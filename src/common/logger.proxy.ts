import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerProxy {
  private static logger: Logger;

  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) logger: Logger) {
    LoggerProxy.logger = logger;
  }

  public static error(message: string, ...meta: any[]) {
    LoggerProxy.logger.error(message, meta);
  }

  public static info(message: string, ...meta: any[]) {
    LoggerProxy.logger.info(message, meta);
  }
}
