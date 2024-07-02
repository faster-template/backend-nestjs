import { BaseDocumentEntity } from '@/core/entities/base-document.entity';
import { Entity } from 'typeorm';

@Entity('article')
export class ArticleEntity extends BaseDocumentEntity {}
