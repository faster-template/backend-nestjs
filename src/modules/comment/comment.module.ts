import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { ArticleModule } from '../article/article.module';
import { BaseDefaultRepository } from '@/core/repository/base.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, BaseDefaultRepository]),
    ArticleModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
