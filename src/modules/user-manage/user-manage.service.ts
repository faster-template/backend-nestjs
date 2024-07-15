import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { IPagination, IPaginationResult } from '@/types';
import { UserManageInfoDto, UserManageSetStateDto } from './user-manage.dto';
import { AutoMapper } from '@/core/auto-mapper';
import { UserService } from '../user/user.service';
import { EState } from '@/core/enums';
import { CustomException } from '@/exception/custom-exception';
// import { UserManageInfoDto } from './user-manage.dto';
// import { IPagination, IPaginationResult } from '@/types';

@Injectable()
export class UserManageService {
  private userRepository: BaseDefaultRepository<UserEntity>;
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.userRepository = new BaseDefaultRepository<UserEntity>(
      dataSource,
      UserEntity,
      'user',
    );
  }

  async getList(
    pagination: IPagination,
  ): Promise<IPaginationResult<UserManageInfoDto>> {
    const qb = (await this.userRepository.paginate(pagination, {
      onlyQueryBuilder: true,
    })) as SelectQueryBuilder<UserEntity>;

    qb.leftJoinAndSelect('user.roles', 'user-role').select([
      'user.id',
      'user.nickName',
      'user.userName',
      'user.phone',
      'user.state',
      'user.createTime',
      'user.avatarUrl',
      'user.wechatOpenId',
      'user-role.id',
      'user-role.roleType',
    ]);

    const [items, total] = await qb.getManyAndCount();
    return {
      items: AutoMapper.MapperTo(items, UserManageInfoDto),
      total,
    };
  }

  async setState(stateDto: UserManageSetStateDto): Promise<void> {
    const user = await this.userService.findOneById(stateDto.id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    if (user.id === this.request['user'].id) {
      throw new CustomException('不能操作自己的状态');
    } else {
      user.state = EState.Disable;
      await this.userRepository.save(user);
      return null;
    }
  }
}
