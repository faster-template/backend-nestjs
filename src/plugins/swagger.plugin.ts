import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default {
  install: (app) => {
    const options = new DocumentBuilder()
      .setTitle('接口API-Swagger')
      .setDescription('API文档')
      .setVersion('1.0')
      .addTag('app')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  },
};
