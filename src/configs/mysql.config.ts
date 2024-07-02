import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';

export const mysqlConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    timezone: '+08:00', // 时区
    entities: [__dirname + '../modules/**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') == 'development',
    autoLoadEntities: true,
    // entityPrefix: 't_',
    // migrations: ['dist/migration/*.js'],
    // cli: {
    //   migrationsDir: 'src/migration',
    // },
  }),
  inject: [ConfigService],
};
