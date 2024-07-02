import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BaseDefaultRepository])],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {}
