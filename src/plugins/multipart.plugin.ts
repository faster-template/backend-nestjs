import fastifyMultipart from '@fastify/multipart';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export default {
  install: (app: NestFastifyApplication) => {
    // 注册 multipart ,实现文件上传
    // 处理formData 请求
    app.register(fastifyMultipart, {
      attachFieldsToBody: true,
      limits: {
        fieldNameSize: 100, // 字段名的最大长度
        fieldSize: 1000000, // 字段值的最大长度（1MB）
        fields: 10, // 允许的最大字段数
        fileSize: 4 * 1000000, // 单个文件的最大大小（1MB）
        files: 9, // 允许的最大文件数
        headerPairs: 2000, // 允许的最大头部对数
      },
    });
  },
};
