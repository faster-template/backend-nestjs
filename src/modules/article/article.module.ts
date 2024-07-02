import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { DraftModule } from '../draft/draft.module';

@Module({
  imports: [
    DraftModule,
    TypeOrmModule.forFeature([ArticleEntity, BaseDefaultRepository]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
