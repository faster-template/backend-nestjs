import { EState } from '@/core/enums';
import { IPayload } from '@/modules/user-auth/user-auth.interface';
import { UserEntity } from '@/modules/user/user.entity';
import { ClassConstructor, ClassTransformOptions } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMapper } from '../auto-mapper';

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

  Mapper<T>(tar?: ClassConstructor<T>, option?: ClassTransformOptions) {
    return AutoMapper.MapperTo(this, tar, option);
  }
}

export abstract class BaseWithCreatorEntity extends BaseDefaultEntity {
  @JoinColumn({ name: 'creatorId' })
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  creator: UserEntity;
  @Column({ nullable: true })
  creatorId: string;

  isCreator(user: IPayload) {
    return user.id == this.creatorId;
  }
}
