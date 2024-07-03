import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CategoryCreateDto,
  CategorySortDto,
  CategoryUpdateDto,
} from './category.dto';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Roles(EUserRole.SuperAdmin)
  create(@Body() createCategoryDto: CategoryCreateDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('rootList')
  @Roles(EUserRole.SuperAdmin)
  rootList() {
    return this.categoryService.rootList();
  }

  @Get('getChildren')
  getChildren(@Query('id') id: string) {
    return this.categoryService.getChildren(id);
  }

  @Get('getChildrenByKey')
  getChildrenByKey(@Query('key') key: string) {
    return this.categoryService.getChildrenByKey(key);
  }

  @Post('update')
  @Roles(EUserRole.SuperAdmin)
  update(@Body() updateCategoryDto: CategoryUpdateDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Post('delete')
  @Roles(EUserRole.SuperAdmin)
  remove(@Body('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Post('sort')
  @Roles(EUserRole.SuperAdmin)
  sort(@Body() sortDto: CategorySortDto) {
    return this.categoryService.sort(
      sortDto.sourceId,
      sortDto.targetId,
      sortDto.position,
    );
  }
}
