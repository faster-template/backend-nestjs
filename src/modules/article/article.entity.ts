import { BaseDocumentEntity } from '@/core/entities/base-document.entity';
import { Entity } from 'typeorm';

@Entity('article', {
  orderBy: {
    createTime: 'DESC',
  },
})
export class ArticleEntity extends BaseDocumentEntity {}
