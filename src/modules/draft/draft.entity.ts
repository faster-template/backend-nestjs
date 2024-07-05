import { BaseWithCreatorEntity } from '@/core/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { EDraftType, EResourceType } from './draft.enum';

@Entity('draft', {
  orderBy: {
    createTime: 'DESC',
  },
})
export class DraftEntity extends BaseWithCreatorEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: EResourceType.ARTICLE,
  })
  resourceType: EResourceType;

  @Column({ type: 'varchar', length: 255, nullable: false })
  resourceId: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: EDraftType.UNPUBLISH,
  })
  draftType: EDraftType;

  @Column({ type: 'text', nullable: false })
  contentJson: string;
}
