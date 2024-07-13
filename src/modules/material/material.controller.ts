import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MaterialService } from './material.service';
import { Pagination } from '@/decorators/pagination.decorator';
import { EMaterialType, EOssType } from './material.enum';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';
import { MaterialCreateDto } from './material.dto';
import { IPaginationParams, PaginationDto } from '@/types';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get('getList')
  @Roles(EUserRole.SuperAdmin)
  getList(
    @Pagination() paginationParams: IPaginationParams,
    @Query('type') type: EMaterialType,
    @Query('ossType') ossType: EOssType,
  ) {
    const pagination = new PaginationDto(paginationParams);
    pagination.where = [
      {
        field: 'type',
        value: type,
      },
      {
        field: 'ossType',
        value: ossType,
      },
    ];
    return this.materialService.getList(pagination);
  }

  @Post('create')
  @Roles(EUserRole.SuperAdmin)
  create(@Body() createMaterialDto: MaterialCreateDto) {
    return this.materialService.create(createMaterialDto);
  }
}
