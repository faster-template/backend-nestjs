import { Entity, Column, OneToMany } from 'typeorm';

import { UserRoleEntity } from '../user-role/user-role.entity';
import { BaseDefaultEntity } from '@/core/entities/base.entity';

@Entity('user')
export class UserEntity extends BaseDefaultEntity {
  @Column({ nullable: true, unique: true, length: 20 })
  userName: string;

  @Column({ nullable: true, unique: true, length: 50 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  password: string;

  @Column({ nullable: true, unique: true, length: 50 })
  passwordSalt: string;

  @Column({ nullable: true, unique: true, length: 20 })
  nickName: string;

  @Column({ nullable: true, length: 200 })
  avatarUrl: string;

  @Column({ nullable: true, unique: true, length: 32 })
  wechatOpenId: string;

  @Column({ nullable: true, unique: true, length: 32 })
  wechatUnionId: string;

  @OneToMany(() => UserRoleEntity, (role) => role.user, { nullable: true })
  roles: UserRoleEntity[];
}
