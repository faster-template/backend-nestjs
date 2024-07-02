import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentCreateDto } from './comment.dto';
import { ECommentRelationType } from './comment.enum';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  create(@Body() comment: CommentCreateDto) {
    return this.commentService.create(comment);
  }

  @Post('delete')
  delete(@Body() id: string) {
    return this.commentService.delete(id);
  }

  @Get('getList')
  getList(
    @Query('relationId') relationId: string,
    @Query('relationType') relationType: ECommentRelationType,
  ) {
    return this.commentService.getList({ relationId, relationType });
  }
}
