import { BaseWithCreatorEntity } from '@/core/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { EMaterialType, EOssType } from './material.enum';

@Entity('material')
export class MaterialEntity extends BaseWithCreatorEntity {
  @Column({
    type: 'enum',
    enum: EMaterialType,
    nullable: false,
    default: EMaterialType.IMAGE,
  })
  type: EMaterialType;

  @Column({
    type: 'enum',
    enum: EOssType,
    nullable: false,
    default: EOssType.QINIU,
  })
  ossType: EOssType;

  @Column({ type: 'varchar', default: '', nullable: false })
  path: string;
}
