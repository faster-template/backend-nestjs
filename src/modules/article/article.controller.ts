import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleUpdateDto } from './article.dto';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';
import { EState } from '@/core/enums';
import { Pagination } from '@/decorators/pagination.decorator';
import {
  EWhereOperator,
  PaginationDto,
} from '@/core/repository/base.repository';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('save')
  @Roles(EUserRole.SuperAdmin)
  save(@Body() UpdateArticleDto: ArticleUpdateDto) {
    return this.articleService.save(UpdateArticleDto, EState.Normal);
  }

  @Get('getList')
  @Roles(EUserRole.SuperAdmin)
  getList(
    @Pagination() pagination: PaginationDto,
    @Query('title') title: string,
    @Query('state') state: EState,
    @Query('categoryId') categoryId: string,
  ) {
    pagination.where = [
      {
        field: 'title',
        value: title ? `%${title}%` : null,
        operator: EWhereOperator.Like,
      },
      {
        field: 'state',
        value: state,
      },
      {
        field: 'categoryId',
        value: categoryId,
      },
    ];
    return this.articleService.getList(pagination, true);
  }

  @Get('list')
  getArticleList(
    @Pagination() pagination: PaginationDto,
    @Query('title') title: string,
    @Query('categoryId') categoryId: string,
  ) {
    pagination.where = [
      {
        field: 'title',
        value: title ? `%${title}%` : null,
        operator: EWhereOperator.Like,
      },
      {
        field: 'state',
        value: EState.Normal,
      },
      {
        field: 'categoryId',
        value: categoryId,
      },
    ];
    return this.articleService.getList(pagination, false);
  }

  @Get('getDetail')
  findOne(@Query('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Post('delete')
  @Roles(EUserRole.SuperAdmin)
  delete(@Query('id') id: string) {
    return this.articleService.delete(id);
  }

  @Post('saveAsDraft')
  @Roles(EUserRole.SuperAdmin)
  saveAsDraft(@Body() updateArticleDto: ArticleUpdateDto) {
    return this.articleService.save(updateArticleDto);
  }

  @Get('getDraftList')
  @Roles(EUserRole.SuperAdmin)
  getDraftList(@Query('id') id: string) {
    return this.articleService.getDraftList(id);
  }
  @Post('publish')
  @Roles(EUserRole.SuperAdmin)
  publish(@Query('id') id: string) {
    return this.articleService.changeState(id, EState.Normal);
  }

  @Post('unPublish')
  @Roles(EUserRole.SuperAdmin)
  unPublish(@Query('id') id: string) {
    return this.articleService.changeState(id, EState.Draft);
  }
}
