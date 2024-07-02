import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryEntity } from './category.entity';
import { DataSource } from 'typeorm';
import { CustomException } from '@/exception/custom-exception';
import { BaseTreeRepository } from '@/core/repository/base-tree.repository';

@Injectable()
export class CategoryService {
  private categoryRepository: BaseTreeRepository<CategoryEntity>;
  constructor(private dataSource: DataSource) {
    this.categoryRepository = new BaseTreeRepository<CategoryEntity>(
      dataSource,
      CategoryEntity,
      'category',
    );
  }

  // 创建分类
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
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
  update(updateCategoryDto: UpdateCategoryDto) {
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
      this.categoryRepository.delete(id);
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
