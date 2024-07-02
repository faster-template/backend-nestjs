import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from './user-role.entity';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleEntity])],
  exports: [TypeOrmModule],
  providers: [UserRoleService],
})
export class UserRoleModule {}
