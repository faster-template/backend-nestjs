import { Column, Entity } from 'typeorm';
import { ELikeRelationType, ELikeType } from './like.enum';
import { BaseWithCreatorEntity } from '@/core/entities/base.entity';

@Entity('like')
export class LikeEntity extends BaseWithCreatorEntity {
  @Column({ nullable: false })
  relationId: string;

  @Column({ nullable: false })
  relationType: ELikeRelationType;

  @Column({ nullable: false })
  likeType: ELikeType;
}
