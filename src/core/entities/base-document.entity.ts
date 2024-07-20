import { BaseWithCreatorEntity } from '@/core/entities/base.entity';
import { CategoryEntity } from '@/modules/category/category.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { EArticleContentMode } from '../enums';

export class BaseDocumentEntity extends BaseWithCreatorEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cover: string;

  @Column({ default: EArticleContentMode.RICHTEXT })
  contentMode: EArticleContentMode;

  @Column({ type: 'int', nullable: false, default: 0 })
  views: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  likes: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  comments: number;

  @ManyToOne(() => CategoryEntity, (category) => category.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  isTop: number;
}
