import { BaseTreeEntity } from '@/core/entities/base-tree.entity';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('category')
@Tree('materialized-path')
export class CategoryEntity extends BaseTreeEntity<CategoryEntity> {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string; // 名称

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  key: string; // 用来标识分类的唯一值

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @TreeParent()
  parent: CategoryEntity;

  @TreeChildren({ cascade: true })
  children: CategoryEntity[];

  @Column({ type: 'int', nullable: false, default: 0 })
  sort: number;
}
