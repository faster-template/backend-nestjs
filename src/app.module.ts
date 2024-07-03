import { Dependencies, Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
// import * as winston from 'winston';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './configs/winston.config';
import { mysqlConfig } from './configs/mysql.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ResponseInterceptor } from './interceptors/response.interceptor';
import { JwtAuthGuard } from './guards/passport-guards/jwt.guard';
import { UserAuthModule } from './modules/user-auth/user-auth.module';
// import { JwtModule } from '@nestjs/jwt';

// import { UserModule } from './modules/user/user.module';
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module';
import { ArticleModule } from './modules/article/article.module';
import { RolesGuard } from './guards/role.guard';
import { CategoryModule } from './modules/category/category.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { DraftModule } from './modules/draft/draft.module';
import { VerifyCodeModule } from './modules/verify-code/verify-code.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTaskModule } from './schedule-task/schedule-task.module';
import { UploadModule } from './modules/upload/upload.module';
import { CsrfInterceptor } from './interceptors/csrf.interceptor';
import { MaterialModule } from './modules/material/material.module';

@Global()
@Dependencies(DataSource)
@Module({
  imports: [
    // 日志
    WinstonModule.forRoot(winstonConfig),
    // 数据库持久化 ORM
    TypeOrmModule.forRootAsync(mysqlConfig),
    // 配置环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
    // 定时任务
    ScheduleModule.forRoot(),
    // axios
    HttpModule,
    // 业务Modules
    UserModule,
    UserAuthModule, // UserAuthModule imports->[WechatAuthModule]
    UserRoleModule,
    AdminAuthModule,
    ArticleModule,
    CategoryModule,
    LikeModule,
    CommentModule,
    DraftModule,
    VerifyCodeModule,
    ScheduleTaskModule,
    UploadModule,
    MaterialModule,
  ],
  controllers: [],
  providers: [
    // // 用户认证JWT_TOKEN守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // 用户角色的守卫
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // 拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    // CSRF拦截生成
    {
      provide: APP_INTERCEPTOR,
      useClass: CsrfInterceptor,
    },
  ],
  exports: [HttpModule],
})
export class AppModule {
  dataSource: any;
  constructor(dataSource) {
    this.dataSource = dataSource;
  }
}
