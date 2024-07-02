import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), ArticleModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
