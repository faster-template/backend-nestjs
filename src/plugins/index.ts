import { NestFastifyApplication } from '@nestjs/platform-fastify';
import loggerPlugin from './logger.plugin';
import swaggerPlugin from './swagger.plugin';
import initDbPlugin from './init-db.plugin';
import multipartPlugin from './multipart.plugin';
import securityPlugin from './security.plugin';
import validatePlugin from './validate.plugin';
import autoMapper from './auto-mapper';
import exceptionPlugin from './exception.plugin';
export default {
  install: async (app: NestFastifyApplication) => {
    const isProduction = process.env.NODE_ENV === 'production';
    // 日志模块
    loggerPlugin.install(app);
    // 错误模块
    exceptionPlugin.install(app);
    // formData处理 - 文件上传
    multipartPlugin.install(app);
    // security 安全模块
    await securityPlugin.install(app);
    // valid 验证模块
    validatePlugin.install(app);
    autoMapper.install();
    // 仅在非生产时运行
    if (!isProduction) {
      await initDbPlugin.install(app);
      // doc-api
      swaggerPlugin.install(app);
    }
  },
};
