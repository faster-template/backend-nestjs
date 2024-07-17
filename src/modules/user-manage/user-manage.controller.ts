import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserManageService } from './user-manage.service';
import { Pagination } from '@/decorators/pagination.decorator';
import { IPaginationParams } from '@/types';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';
import { UserManageQueryDto, UserManageSetStateDto } from './user-manage.dto';

@Controller('user-manage')
export class UserManageController {
  constructor(private readonly userManageService: UserManageService) {}

  @Get('getList')
  @Roles(EUserRole.SuperAdmin)
  getList(
    @Pagination() paginationParams: IPaginationParams,
    @Query() queryParams: UserManageQueryDto,
  ) {
    return this.userManageService.getList(paginationParams, queryParams);
  }

  @Post('setState')
  @Roles(EUserRole.SuperAdmin)
  setState(@Body() setStateDto: UserManageSetStateDto) {
    return this.userManageService.setState(setStateDto);
  }
}
