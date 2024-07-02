import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export default {
  install: (app: NestFastifyApplication) => {
    // 全局验证管道
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        disableErrorMessages: process.env.NODE_ENV === 'production',
      }),
    );
  },
};
