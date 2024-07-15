import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserManageService } from './user-manage.service';
import { EState } from '@/core/enums';
import { Pagination } from '@/decorators/pagination.decorator';
import { IPaginationParams, PaginationDto, EWhereOperator } from '@/types';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';
import { UserManageSetStateDto } from './user-manage.dto';

@Controller('user-manage')
export class UserManageController {
  constructor(private readonly userManageService: UserManageService) {}

  @Get('getList')
  @Roles(EUserRole.SuperAdmin)
  getList(
    @Pagination() paginationParams: IPaginationParams,
    @Query('nickName') nickName: string,
    @Query('userName') userName: string,
    @Query('state') state: EState,
  ) {
    const pagination = new PaginationDto(paginationParams);
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
    return this.userManageService.getList(pagination);
  }

  @Post('setState')
  @Roles(EUserRole.SuperAdmin)
  setState(@Body() setStateDto: UserManageSetStateDto) {
    return this.userManageService.setState(setStateDto);
  }
}
