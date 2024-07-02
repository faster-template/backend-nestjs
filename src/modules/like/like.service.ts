import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LikeEntity } from './like.entity';
import { CommentService } from '../comment/comment.service';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ArticleService } from '../article/article.service';
import {
  LikeAddDto,
  LikeCountViewDto,
  LikeDeleteDto,
  LikeQueryDto,
} from './like.dto';
import { ELikeType } from './like.enum';

@Injectable()
export class LikeService {
  private likeRepository: BaseDefaultRepository<LikeEntity>;
  constructor(
    private dataSource: DataSource,
    @Inject(REQUEST) private readonly request: Request,
    private articleService: ArticleService,
    private commentService: CommentService,
  ) {
    this.likeRepository = new BaseDefaultRepository<LikeEntity>(
      dataSource,
      LikeEntity,
      'like',
    );
  }

  async add(likeDto: LikeAddDto) {
    const { relationId, relationType, likeType } = likeDto;
    const likeExistEntity = await this.likeRepository.findOne({
      where: { relationId, relationType },
    });
    if (likeExistEntity) {
      if (likeExistEntity.likeType === likeType) return;
      likeExistEntity.likeType = likeType;
      await this.likeRepository.save(likeExistEntity);
      return;
    }
    const user = this.request['user'];
    const likeEntity = this.likeRepository.create({
      ...likeDto,
      creatorId: user.id,
    });
    await this.likeRepository.save(likeEntity);
  }

  async delete(deleteDto: LikeDeleteDto): Promise<void> {
    const { relationId, relationType } = deleteDto;
    const likeEntity = await this.likeRepository.findOne({
      where: { relationId, relationType },
    });
    if (likeEntity) {
      await this.likeRepository.remove(likeEntity);
    }
  }

  async getCount(LikeQueryDto: LikeQueryDto): Promise<LikeCountViewDto> {
    const { relationId, relationType } = LikeQueryDto;
    const [allLikeEntities, total] = await this.likeRepository.findAndCount({
      where: { relationId, relationType },
    });
    const Likes = allLikeEntities.filter((t) => t.likeType === ELikeType.Like);
    const myLike = allLikeEntities.find(
      (t) => t.creatorId == this.request['user'].id,
    );
    return {
      likeCount: Likes.length,
      dislikeCount: total - Likes.length,
      myLikeType: myLike ? myLike.likeType : null,
    };
  }
}
