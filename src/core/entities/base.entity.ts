import { EState } from '@/core/enums';
import { UserEntity } from '@/modules/user/user.entity';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseDefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn()
  createTime: Date;
  // 定义一个updateTime字段，默认值是当前时间戳

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updateTime: Date;

  @Column({ default: EState.Normal })
  state: EState;

  Mapper<T>(
    tar: ClassConstructor<T>,
    option: ClassTransformOptions = {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    },
  ) {
    return plainToClass(tar, this, option);
  }
}

export abstract class BaseWithCreatorEntity extends BaseDefaultEntity {
  @JoinColumn({ name: 'creatorId' })
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  creator: UserEntity;
  @Column({ nullable: true })
  creatorId: string;
}
