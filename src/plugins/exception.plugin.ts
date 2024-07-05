import { AllExceptionFilter } from '@/filters/all-exception.fillter';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export default {
  install: (app: NestFastifyApplication) => {
    // 日志模块
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    // 全局异常处理
    app.useGlobalFilters(new AllExceptionFilter(logger));
    // 全局未捕获异常处理
    // 未捕获的异常
    process.on('uncaughtException', (error) => {
      logger.error(`未捕获的异常: `, error);
      // 这里可以添加你的错误处理逻辑，比如发送警报等
    });

    // 未处理的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('未处理的Promise拒绝:', promise, 'reason:', reason);
      // 这里可以添加你的错误处理逻辑，比如发送警报等
    });
  },
};
