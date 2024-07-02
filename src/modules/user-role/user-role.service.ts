import { Injectable } from '@nestjs/common';
import { UserRoleEntity } from './user-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private usersRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async getUserRoles(user: UserEntity): Promise<UserRoleEntity[]> {
    if (!user) {
      return [];
    }
    return await this.usersRoleRepository.find({
      where: {
        user: user,
      },
    });
  }
}
