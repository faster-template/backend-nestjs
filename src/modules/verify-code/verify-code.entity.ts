import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EVerifyCodeType } from './verify-code.enum';

@Entity('verify-code')
export class VerifyCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn()
  createTime: Date;

  @Column({ type: 'varchar', default: '', nullable: false })
  phone: string;

  @Column({ type: 'varchar', default: '', nullable: false })
  code: string;

  @Column({
    type: 'enum',
    enum: EVerifyCodeType,
    nullable: false,
    default: EVerifyCodeType.LOGIN,
  })
  type: EVerifyCodeType;
}
