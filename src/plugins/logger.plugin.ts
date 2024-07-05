import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export default {
  install: (app: NestFastifyApplication) => {
    // 日志模块
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(logger);
  },
};
