import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import {
  BaseDefaultRepository,
  PaginationDto,
  PaginationResult,
} from '@/core/repository/base.repository';
import { EState } from '@/core/enums';
import { REQUEST } from '@nestjs/core';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ArticleUpdateDto } from './article.dto';
import { DraftService } from '../draft/draft.service';
import { EDraftType, EResourceType } from '../draft/draft.enum';
import { CustomException } from '@/exception/custom-exception';
import { DraftEntity } from '../draft/draft.entity';

@Injectable()
export class ArticleService {
  private articleRepository: BaseDefaultRepository<ArticleEntity>;

  constructor(
    private dataSource: DataSource,
    private draftService: DraftService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.articleRepository = new BaseDefaultRepository<ArticleEntity>(
      dataSource,
      ArticleEntity,
      'article',
    );
  }

  async findAll(): Promise<ArticleEntity[]> {
    const queryBuilder = (await this.articleRepository.onlyQueryNormal({
      onlyQueryBuilder: true,
    })) as SelectQueryBuilder<ArticleEntity>;
    queryBuilder
      .leftJoinAndSelect('article.creator', 'user')
      .select([
        'article.id',
        'article.title',
        'article.createTime',
        'article.updateTime',
        'article.state',
        'article.creatorId',
        'user.id',
        'user.nickName',
      ]);

    return await queryBuilder.getMany();
  }

  async getList(
    pagination: PaginationDto,
    includeDraft: boolean = false,
  ): Promise<PaginationResult<ArticleEntity>> {
    let queryBuilder = this.articleRepository.createQueryBuilder('article');
    if (!includeDraft) {
      queryBuilder = (await this.articleRepository.onlyQueryNormal({
        queryBuilder,
        onlyQueryBuilder: true,
      })) as SelectQueryBuilder<ArticleEntity>;
    }

    queryBuilder
      .leftJoinAndSelect('article.creator', 'user')
      .leftJoinAndSelect('article.category', 'category')
      .select([
        'article.id',
        'article.title',
        'article.createTime',
        'article.updateTime',
        'article.state',
        'article.creatorId',
        'user.id',
        'user.nickName',
        'category.id',
        'category.name',
      ]);

    return (await this.articleRepository.paginate(pagination, {
      queryBuilder,
      onlyQueryBuilder: false,
    })) as PaginationResult<ArticleEntity>;
  }

  async findOne(id: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      where: { id },
    });
  }
  // 获取草稿列表
  async getDraftList(id: string): Promise<DraftEntity[]> {
    const article = await this.findOne(id);
    if (
      article &&
      (article.isCreator(this.request['user']) || this.request['user'].isAdmin)
    ) {
      return this.draftService.findDrafts(EResourceType.ARTICLE, id);
    } else {
      throw new NotFoundException('未找到资源');
    }
  }

  // 修改文章状态
  async changeState(id: string, state: EState): Promise<void> {
    const article = await this.findOne(id);
    if (article) {
      article.state = state;
      await this.articleRepository.save(article);
    } else {
      throw new NotFoundException('文章不存在');
    }
  }

  /**
   *  保存，同时会保存一份草稿
   * @param article 文章
   * @returns
   */
  async save(
    article: ArticleUpdateDto,
    state: EState = EState.Draft,
  ): Promise<ArticleUpdateDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const _repository = queryRunner.manager.getRepository(ArticleEntity);
      const articleEntity = _repository.create(article);
      articleEntity.state = state;
      if (!article.id) {
        // 从article中移除id
        Reflect.deleteProperty(articleEntity, 'id');
        articleEntity.creatorId = this.request['user'].id;
        article = await _repository.save(articleEntity);
      } else {
        if (state == EState.Normal) {
          await _repository.update(article.id, articleEntity);
        }
      }
      await this.draftService.createWithTransaction(
        {
          resourceType: EResourceType.ARTICLE,
          resourceId: article.id,
          drafType:
            state == EState.Draft ? EDraftType.UNPUBLISH : EDraftType.PUBLISHED,
          contentJson: JSON.stringify({
            title: article.title,
            content: article.content,
          }),
        },
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return article;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<void> {
    const article = await this.findOne(id);
    if (article) {
      if (article.state !== EState.Normal) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
          await queryRunner.startTransaction();
          const _repository = queryRunner.manager.getRepository(ArticleEntity);
          await this.draftService.deleteDraftsWithTransaction(
            EResourceType.ARTICLE,
            id,
            queryRunner,
          );
          await _repository.remove(article);
          await queryRunner.commitTransaction();
        } catch (err) {
          await queryRunner.rollbackTransaction();
          throw err;
        } finally {
          await queryRunner.release();
        }
      } else {
        throw new CustomException({ message: '文章已发布，请先下架再删除。' });
      }
    } else {
      throw new NotFoundException('文章不存在');
    }
  }
}
