import { Body, Controller, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeAddDto } from './like.dto';

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
}
