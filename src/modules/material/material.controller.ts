import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MaterialService } from './material.service';
import { Pagination } from '@/decorators/pagination.decorator';
import { PaginationDto } from '@/core/repository/base.repository';
import { EMaterialType, EOssType } from './material.enum';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';
import { MaterialCreateDto } from './material.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get('getList')
  @Roles(EUserRole.SuperAdmin)
  getList(
    @Pagination() pagination: PaginationDto,
    @Query('type') type: EMaterialType,
    @Query('ossType') ossType: EOssType,
  ) {
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
