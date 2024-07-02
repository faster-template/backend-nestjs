import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LikeEntity } from './like.entity';
import { CommentService } from '../comment/comment.service';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ArticleService } from '../article/article.service';
import { LikeAddDto } from './like.dto';

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

  async delete(id: string): Promise<void> {
    if (!id) throw new NotFoundException('id不能为空');
    const likeEntity = await this.likeRepository.findOne({ where: { id } });
    if (likeEntity) {
      await this.likeRepository.remove(likeEntity);
    }
  }
}
