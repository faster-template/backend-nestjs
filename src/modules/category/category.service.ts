import { CategoryCreateDto, CategoryUpdateDto } from './category.dto';
import { CategoryEntity } from './category.entity';
import { DataSource } from 'typeorm';
import { CustomException } from '@/exception/custom-exception';
import { BaseTreeRepository } from '@/core/repository/base-tree.repository';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
@Injectable()
export class CategoryService {
  private categoryRepository: BaseTreeRepository<CategoryEntity>;
  constructor(
    private dataSource: DataSource,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.categoryRepository = new BaseTreeRepository<CategoryEntity>(
      dataSource,
      CategoryEntity,
      'category',
    );
  }

  // 创建分类
  async create(createCategoryDto: CategoryCreateDto): Promise<CategoryEntity> {
    // 检查Key是否存在
    const category = await this.categoryRepository.findOne({
      where: {
        key: createCategoryDto.key,
      },
    });
    if (category) {
      throw new CustomException('分类Key已存在');
    }
    createCategoryDto.creatorId = this.request['user'].id;
    return this.categoryRepository.createNode(createCategoryDto);
  }

  // 获取根节点分类
  async rootList(): Promise<CategoryEntity[]> {
    return this.categoryRepository.rootList();
  }

  // 获取子节点分类
  async getChildren(id: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.getChildren(id);
  }

  // 获取子节点分类
  async getChildrenByKey(key: string): Promise<CategoryEntity[]> {
    const parent = await this.categoryRepository.findOne({
      where: {
        key,
      },
    });
    if (parent) {
      return this.categoryRepository.getChildren(parent.id);
    } else {
      return [];
    }
  }

  // 更新一个分类
  update(updateCategoryDto: CategoryUpdateDto) {
    // 禁止更新Key
    Reflect.deleteProperty(updateCategoryDto, 'key');
    return this.categoryRepository.update(
      updateCategoryDto.id,
      updateCategoryDto,
    );
  }

  // 删除一个分类
  async remove(id: string): Promise<void> {
    const categoryChildren = await this.getChildren(id);
    if (categoryChildren.length > 0) {
      throw new CustomException({ message: '该分类下有子分类，无法删除' });
    } else {
      await this.categoryRepository.removeNode(id);
    }
  }

  async sort(
    sourceId: string,
    targetId: string | null,
    position: number,
  ): Promise<void> {
    return this.categoryRepository.sort(sourceId, targetId, position);
  }
}
