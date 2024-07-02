import { NestFastifyApplication } from '@nestjs/platform-fastify';
import loggerPlugin from './logger.plugin';
import swaggerPlugin from './swagger.plugin';
import initDbPlugin from './init-db.plugin';
import multipartPlugin from './multipart.plugin';
import securityPlugin from './security.plugin';

export default {
  install: async (app: NestFastifyApplication) => {
    const isProduction = process.env.NODE_ENV === 'production';
    // 日志模块
    loggerPlugin.install(app);
    // formData处理 - 文件上传
    multipartPlugin.install(app);
    // security 安全模块
    await securityPlugin.install(app);
    // 仅在非生产时运行
    if (!isProduction) {
      await initDbPlugin.install(app);
      // doc-api
      swaggerPlugin.install(app);
    }
  },
};
