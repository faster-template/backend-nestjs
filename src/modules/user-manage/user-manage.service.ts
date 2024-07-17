import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  EWhereOperator,
  IPaginationParams,
  IPaginationResult,
  PaginationDto,
} from '@/types';
import {
  UserManageInfoDto,
  UserManageQueryDto,
  UserManageSetStateDto,
} from './user-manage.dto';
import { AutoMapper } from '@/core/auto-mapper';
import { UserService } from '../user/user.service';
import { EState } from '@/core/enums';
import { CustomException } from '@/exception/custom-exception';
import { EUserRole } from '../user-role/user-role.enum';
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
    paginationParams: IPaginationParams,
    queryParams: UserManageQueryDto,
  ): Promise<IPaginationResult<UserManageInfoDto>> {
    const pagination = new PaginationDto(paginationParams);
    const { nickName, userName, state, role } = queryParams;
    pagination.where = [
      {
        field: 'nickName',
        value: nickName ? `%${nickName}%` : null,
        operator: EWhereOperator.Like,
      },
      {
        field: 'userName',
        value: userName ? `%${userName}%` : null,
        operator: EWhereOperator.Like,
      },
      {
        field: 'state',
        value: state,
      },
    ];

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
    if (role) {
      if (role !== EUserRole.Default) {
        qb.where('user-role.roleType = :role', { role });
      } else {
        qb.where('user-role.roleType not in (:role)', {
          role: [EUserRole.SuperAdmin, EUserRole.Admin],
        });
      }
    }

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
