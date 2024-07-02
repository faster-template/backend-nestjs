import { Column, Entity, TreeChildren, TreeParent } from 'typeorm';
import { ECommentRelationType } from './comment.enum';
import { BaseTreeEntity } from '@/core/entities/base-tree.entity';

@Entity('comment')
export class CommentEntity extends BaseTreeEntity<CommentEntity> {
  @TreeParent()
  parent: CommentEntity;

  @TreeChildren({ cascade: true })
  children: CommentEntity[];

  @Column({ type: 'int', nullable: false, default: 0 })
  sort: number;

  @Column({ nullable: false })
  relationId: string;

  @Column({ nullable: false })
  relationType: ECommentRelationType;

  @Column({ type: 'text', nullable: false })
  content: string;
}
