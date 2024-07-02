import { Body, Controller, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeAddDto, LikeQueryDto } from './like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('add')
  add(@Body() like: LikeAddDto) {
    return this.likeService.add(like);
  }

  @Post('delete')
  delete(@Body('id') id: string) {
    return this.likeService.delete(id);
  }

  @Post('getCount')
  getCount(@Query() likeQueryDto: LikeQueryDto) {
    return this.likeService.getCount(likeQueryDto);
  }
}
