import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CategorySortDto,
  UpdateCategoryDto,
} from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('rootList')
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
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Post('delete')
  remove(@Body('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Post('sort')
  sort(@Body() sortDto: CategorySortDto) {
    return this.categoryService.sort(
      sortDto.sourceId,
      sortDto.targetId,
      sortDto.position,
    );
  }
}
