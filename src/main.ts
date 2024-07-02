import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import plugins from '@/plugins';
async function bootstrap() {
  const app = (await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )) as NestFastifyApplication;
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Origin',
      'Authorization',
      // 'X-Csrf-Token',
      // 'x-csrf-token',
    ],
  });

  await plugins.install(app);
  await app.listen(3000);

  console.log(
    '\x1B[32m%s\x1B[0m',
    'Application is running on: http://localhost:3000',
  );
}
bootstrap();
