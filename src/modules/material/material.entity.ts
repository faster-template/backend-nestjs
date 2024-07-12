import { BaseWithCreatorEntity } from '@/core/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { EFolder, EMaterialType, EOssType } from './material.enum';

@Entity('material', {
  orderBy: {
    createTime: 'DESC',
  },
})
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

  @Column({ type: 'varchar', default: '', nullable: true, length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: EFolder,
    nullable: true,
    default: EFolder.OTHER,
  })
  folder: EFolder;

  @Column({ type: 'varchar', default: '', nullable: false })
  path: string;
}
