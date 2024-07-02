import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseTreeRepository } from '@/core/repository/base-tree.repository';
import {
  CommentCreateDto,
  CommentCreateSuccessViewDto,
  CommentListViewDto,
  CommentQueryDto,
  CommentViewDto,
} from './comment.dto';
import { IPayload } from '../user-auth/user-auth.interface';
import { ECommentRelationType } from './comment.enum';
import { ArticleService } from '../article/article.service';
import { plainToClass } from 'class-transformer';
import { EState } from '@/core/enums';

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

  async create(
    comment: CommentCreateDto,
  ): Promise<CommentCreateSuccessViewDto> {
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

    const result = await this.commentRepository.createNode({
      ...comment,
      creatorId: user.id,
    });
    return result.Mapper(CommentCreateSuccessViewDto);
  }

  async delete(id: string): Promise<void> {
    if (!id) throw new NotFoundException('评论id不能为空');
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('评论不存在');
    const childrens = await this.commentRepository.findDescendants(comment);
    if (childrens.length > 0) {
      comment.state = EState.SoftDeleted;
      comment.content = '评论已被删除';
      await this.commentRepository.save(comment);
    } else {
      await this.commentRepository.remove(comment);
    }
  }

  async getList(commentQueryDto: CommentQueryDto): Promise<CommentListViewDto> {
    const { relationId, relationType } = commentQueryDto;
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { relationId, relationType },
      relations: ['parent'],
    });
    const rootComments = comments.filter((t) => t.parent == null);

    const result = (await Promise.all(
      rootComments.map(async (comment) => {
        return this.commentRepository.findDescendantsTree(comment, {
          relations: ['creator'],
        });
      }),
    )) as unknown as CommentEntity[];
    return {
      list: plainToClass(CommentViewDto, result, {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
      }),
      total,
    };
  }
}
