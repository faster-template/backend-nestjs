import { Inject, Injectable } from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseTreeRepository } from '@/core/repository/base-tree.repository';

@Injectable()
export class CommentService {
  private articleRepository: BaseTreeRepository<CommentEntity>;
  constructor(
    private dataSource: DataSource,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.articleRepository = new BaseTreeRepository<CommentEntity>(
      dataSource,
      CommentEntity,
      'comment',
    );
  }
}
