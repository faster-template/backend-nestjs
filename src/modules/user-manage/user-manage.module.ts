import { Module } from '@nestjs/common';
import { UserManageService } from './user-manage.service';
import { UserManageController } from './user-manage.controller';
import { UserEntity } from '../user/user.entity';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BaseDefaultRepository]),
    UserModule,
  ],
  controllers: [UserManageController],
  providers: [UserManageService, UserService],
  exports: [UserManageService, UserService],
})
export class UserManageModule {}
