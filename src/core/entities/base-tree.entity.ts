import { BaseWithCreatorEntity } from '@/core/entities/base.entity';
import { Column, Tree, TreeChildren, TreeParent } from 'typeorm';

/* 待解决:在具体业务中使继承Entity时而不去定义Parent和Children时会报错：
TypeORMError: Entity metadata for CategoryEntity#parent was not found.
所以具体业务中继承BaseTreeEntity时，需要定义Parent和Children。
此处为了在使用Repository时能够正确地找到父子关系
*/
@Tree('materialized-path')
export abstract class BaseTreeEntity<T> extends BaseWithCreatorEntity {
  @TreeParent()
  parent: T;

  @TreeChildren({ cascade: true })
  children: T[];

  @Column({ type: 'int', nullable: false, default: 0 })
  sort: number;
}
