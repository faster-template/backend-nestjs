import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DraftCreateDto } from './draft.dto';
import { DraftEntity } from './draft.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EResourceType } from './draft.enum';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class DraftService {
  private draftRepository: BaseDefaultRepository<DraftEntity>;
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.draftRepository = new BaseDefaultRepository<DraftEntity>(
      dataSource,
      DraftEntity,
      'draft',
    );
  }

  // 创建一条草稿
  async create(createDraftDto: DraftCreateDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await this.createWithTransaction(createDraftDto, queryRunner);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 创建一条草稿
  async createWithTransaction(
    createDraftDto: DraftCreateDto,
    queryRunner: QueryRunner,
  ) {
    const _repository = queryRunner.manager.getRepository(DraftEntity);
    const { resourceType, resourceId } = createDraftDto;
    // 检查草稿Limit10条
    const drafList = await _repository.find({
      where: {
        resourceType,
        resourceId,
      },
      order: {
        createTime: 'ASC',
      },
    });
    // 如果超过上限，则删除掉最早的草稿
    const limitSize = (this.configService.get('DRAFT_LIMIT') as number) || 10;
    if (drafList.length >= limitSize) {
      const delDrafList = drafList.slice(0, drafList.length - (limitSize - 1));
      await _repository.delete(delDrafList.map((item) => item.id));
    }
    // 检查是否有相同内容的草稿,有则删除以前的旧草稿
    const sameDrafs = drafList.filter((item) => {
      return item.contentJson == createDraftDto.contentJson;
    });
    if (sameDrafs && sameDrafs.length > 0) {
      if (sameDrafs.length > 1) {
        await _repository.delete(
          sameDrafs.slice(0, sameDrafs.length - 1).map((item) => item.id),
        );
      }
    } else {
      const draf = _repository.create(createDraftDto);
      draf.creatorId = this.request['user'].id;
      await _repository.save(draf);
    }
  }

  // 获取草稿列表
  findDrafts(
    resourceType: EResourceType,
    resourceId: string,
    repository: BaseDefaultRepository<DraftEntity> = this.draftRepository,
  ) {
    return repository.findWithMapper({
      where: {
        resourceType,
        resourceId,
      },
    });
  }

  // 删除草稿
  async deleteDrafts(
    resourceType: EResourceType,
    resourceId: string,
    repository: BaseDefaultRepository<DraftEntity> = this.draftRepository,
  ) {
    const drafList = await this.findDrafts(
      resourceType,
      resourceId,
      repository,
    );
    if (drafList && drafList.length > 0) {
      return await repository.delete(drafList.map((item) => item.id));
    }
  }

  // 删除草稿
  async deleteDraftsWithTransaction(
    resourceType: EResourceType,
    resourceId: string,
    queryRunner: QueryRunner,
  ) {
    const _repository = queryRunner.manager.getRepository(
      DraftEntity,
    ) as BaseDefaultRepository<DraftEntity>;
    return await this.deleteDrafts(resourceType, resourceId, _repository);
  }
}
