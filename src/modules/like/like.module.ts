import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './like.entity';
import { CommentModule } from '../comment/comment.module';
import { ArticleModule } from '../article/article.module';
import { BaseDefaultRepository } from '@/core/repository/base.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, BaseDefaultRepository]),
    CommentModule,
    ArticleModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
