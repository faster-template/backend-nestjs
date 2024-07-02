import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BaseDefaultEntity } from '@/core/entities/base.entity';
import { EUserRole } from './user-role.enum';
@Entity('user-role')
export class UserRoleEntity extends BaseDefaultEntity {
  @ManyToOne(() => UserEntity, (user) => user.roles)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  roleType: EUserRole;
}
