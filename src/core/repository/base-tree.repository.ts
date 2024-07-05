import { BaseTreeEntity } from './../entities/base-tree.entity';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  FindTreeOptions,
  TreeRepository,
} from 'typeorm';
import { BaseTreeNodeDto } from '../dto/base-tree.dto';
import { CustomException } from '@/exception/custom-exception';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '@nestjs/common';
import { AutoMapper } from '../auto-mapper';

const sortChild = <CustomEntity extends BaseTreeEntity<CustomEntity>>(
  sortedNodes: CustomEntity[],
): CustomEntity[] => {
  for (const node of sortedNodes) {
    if (node.children && node.children.length > 0) {
      node.children = sortChild(node.children);
    }
  }
  return sortedNodes.sort((a, b) => a.sort - b.sort);
};

export class BaseTreeRepository<
  CustomEntity extends BaseTreeEntity<CustomEntity>,
> extends TreeRepository<CustomEntity> {
  private entity: EntityTarget<CustomEntity>;
  constructor(
    private dataSource: DataSource,
    entity: EntityTarget<CustomEntity>,
    private alias: string = 'tree-entity',
  ) {
    super(entity, dataSource.manager);
    this.entity = entity;
  }

  async getNode(id: string) {
    const node = await this.findOneWithAutoMapper({
      where: {
        id,
      } as FindOptionsWhere<CustomEntity>,
      relations: ['children', 'creator'],
    });
    return node;
  }
  // 创建分类
  async createNode<CreateDto extends BaseTreeNodeDto>(createDto: CreateDto) {
    const createEntity = {} as CustomEntity;
    Object.assign(createEntity, createDto);
    if (createDto.parentId) {
      const parent = await this.getNode(createDto.parentId);
      if (parent) {
        createEntity['parent'] = parent;
        createEntity.sort = parent.children.length + 1;
      } else {
        throw new NotFoundException('上层内容不存在');
      }
    } else {
      const rootNodes = await this.findRoots({
        depth: 1,
      });
      createEntity.sort = rootNodes.length + 1;
    }
    const o = this.create(createEntity);
    return this.save(o);
  }
  // 删除分类
  // 同时将后续节点挪上来
  async removeNode(id: string) {
    const node = await this.findOne({
      where: { id } as FindOptionsWhere<CustomEntity>,
      relations: ['parent'],
    });
    if (node) {
      const children = await this.findDescendants(node);
      console.log(children);
      if (children && children.length > 1) {
        throw new CustomException('存在子元素，无法删除');
      }
      if (node.parent) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
          await queryRunner.startTransaction();
          const _repository = queryRunner.manager.getRepository(this.entity);
          const qb = _repository.createQueryBuilder(this.alias);

          qb.andWhere(`${this.alias}.parentId = :parentId`, {
            parentId: node.parent.id,
          });
          qb.andWhere(`${this.alias}.sort > :sort`, { sort: node.sort });
          const brothers = await qb.getMany();
          brothers.forEach((item) => {
            item.sort = item.sort - 1;
          });
          await _repository.save(brothers);
          await _repository.remove(node);
          await queryRunner.commitTransaction();
        } catch (err) {
          await queryRunner.rollbackTransaction();
          throw err;
        } finally {
          await queryRunner.release();
        }
      } else {
        await this.remove(node);
      }
    } else {
      throw new NotFoundException('元素不存在');
    }
  }

  /**
   *  返回根节点列表
   * @returns 根节点列表
   */
  async rootList() {
    const rootList = await this.findRootsWithAutoMapper({
      depth: 1,
    });
    return rootList.sort((a, b) => a.sort - b.sort);
  }

  // 获取子节点列表
  async getChildren(id: string): Promise<CustomEntity[]> {
    const parent = await this.getNode(id);
    if (parent) {
      const parentTree = await this.findDescendantsTree(parent, {
        relations: ['creator'],
      });
      const data = sortChild(parentTree.children) as CustomEntity[];
      return AutoMapper.MapperTo(data);
    } else {
      throw new NotFoundException('上层内容不存在');
    }
  }

  // 排序
  async sort(sourceId: string, targetId: string | null, position: number) {
    const source = await this.findOne({
      where: { id: sourceId } as FindOptionsWhere<CustomEntity>,
      relations: ['parent'],
    });
    const target = await this.findOne({
      where: { id: targetId } as FindOptionsWhere<CustomEntity>,
      relations: ['parent'],
    });
    if (source && target) {
      if (
        source.parent == target.parent ||
        source.parent?.id === target.parent?.id
      ) {
        // target.parent = brother.parent;
        // 目标移动是往上移动还是往下移动
        const isUp = source.sort > target.sort;
        const isUnderTarget = position === 1;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
          await queryRunner.startTransaction();
          const _repository = queryRunner.manager.getRepository(this.entity);
          const qb = _repository.createQueryBuilder(this.alias);
          if (source.parent) {
            qb.andWhere(`${this.alias}.parentId = :parentId`, {
              parentId: source.parent.id,
            });
          } else {
            qb.andWhere(`${this.alias}.parentId is NULL `);
          }
          // 如果往下移动，中间节点+1(source < middle < target)
          // 如果目标在兄弟上方，则兄弟无需动
          // 如果目标在兄弟下方，则兄弟需要动
          //
          // 如果往上移动，中间节点-1,(source > middle > target)
          // 如果目标在兄弟上方，则兄弟需动
          // 如果目标在兄弟下方，则兄弟无需动
          qb.andWhere(`${this.alias}.sort > :minSort`, {
            minSort: Math.min(source.sort, target.sort),
          });
          qb.andWhere(`${this.alias}.sort < :maxSort`, {
            maxSort: Math.max(source.sort, target.sort),
          });
          const willSortEntities = await qb.getMany();
          willSortEntities.forEach((item) => {
            item.sort = isUp ? item.sort + 1 : item.sort - 1;
          });
          const targetSort = Number(target.sort.toString());
          if (isUp) {
            source.sort = isUnderTarget ? targetSort + 1 : targetSort;
            target.sort = isUnderTarget ? target.sort : target.sort + 1;
          } else {
            source.sort = isUnderTarget ? targetSort : targetSort - 1;
            target.sort = isUnderTarget ? target.sort - 1 : target.sort;
          }
          source.sort = target.sort + position;
          for (const item of [...willSortEntities, source, target]) {
            await _repository
              .createQueryBuilder()
              .update(this.entity)
              .set({
                sort: item.sort,
              } as unknown as QueryDeepPartialEntity<CustomEntity>)
              .whereInIds(item.id)
              .execute();
          }

          await queryRunner.commitTransaction();
        } catch (err) {
          await queryRunner.rollbackTransaction();
          throw err;
        } finally {
          await queryRunner.release();
        }
      } else {
        throw new CustomException({ message: '内容不属于同一层' });
      }
    } else {
      throw new NotFoundException('内容不存在');
    }
  }

  async findOneWithAutoMapper(options: FindOneOptions): Promise<CustomEntity> {
    const result = await this.findOne(options);
    return AutoMapper.MapperTo(result);
  }

  async findWithAutoMapper(options: FindManyOptions): Promise<CustomEntity[]> {
    const result = await this.find(options);
    return AutoMapper.MapperTo(result);
  }
  async findRootsWithAutoMapper(
    options: FindTreeOptions,
  ): Promise<CustomEntity[]> {
    const result = await this.findRoots(options);
    return AutoMapper.MapperTo(result);
  }
}
