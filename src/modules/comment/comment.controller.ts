import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
}
