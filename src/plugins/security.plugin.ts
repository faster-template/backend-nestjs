import { NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';

export default {
  install: async (app: NestFastifyApplication) => {
    const isProduction = process.env.NODE_ENV === 'production';
    // csrf - 默认配置
    // await app.register(fastifyCookie);
    // await app.register(fastifyCsrf);

    // 增加一些自定义项
    await app.register(fastifyCookie, {
      secret: process.env.CSRF_SECRET,
    });
    // // 注册 @fastify/csrf-protection 插件
    await app.register(fastifyCsrf, {
      cookieKey: process.env.CSRF_KEY,
      cookieOpts: {
        path: '/',
        maxAge: Number(process.env.CSRF_EXPIRE),
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax', //  sameSite: 'none' | 'lax' | 'none' | 'strict' | boolean;
      },
    });
    // helmet 安全插件
    await app.register(helmet);
  },
};
