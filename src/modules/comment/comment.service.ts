import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseTreeRepository } from '@/core/repository/base-tree.repository';
import { CommentCreateDto, CommentQueryDto } from './comment.dto';
import { IPayload } from '../user-auth/user-auth.interface';
import { ECommentRelationType } from './comment.enum';
import { ArticleService } from '../article/article.service';

@Injectable()
export class CommentService {
  private commentRepository: BaseTreeRepository<CommentEntity>;
  constructor(
    private dataSource: DataSource,
    @Inject(REQUEST) private readonly request: Request,
    private articleService: ArticleService,
  ) {
    this.commentRepository = new BaseTreeRepository<CommentEntity>(
      dataSource,
      CommentEntity,
      'comment',
    );
  }

  async create(comment: CommentCreateDto): Promise<void> {
    const { relationId, relationType } = comment;
    const user = this.request['user'] as IPayload;

    let relationEntity = undefined;
    switch (relationType) {
      case ECommentRelationType.Article:
        relationEntity = await this.articleService.findOne(relationId);
        break;
      default:
        throw new NotFoundException('未找到评论内容');
        break;
    }

    if (!relationEntity) {
      throw new NotFoundException('未找到评论内容');
    }

    await this.commentRepository.createNode({
      ...comment,
      createId: user.id,
    });
  }

  async delete(id: string): Promise<void> {
    if (!id) throw new NotFoundException('评论id不能为空');
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('评论不存在');
    const childrens = await this.commentRepository.findDescendants(comment);
    this.commentRepository.remove([...childrens, comment]);
  }

  async getList(commentQueryDto: CommentQueryDto) {
    const { relationId, relationType } = commentQueryDto;
    const comments = await this.commentRepository.find({
      where: { relationId, relationType, parent: null },
      relations: ['children'],
    });
    return comments;
  }
}
