import { CryptoUtil } from 'src/utils/crypto.util';
import { Expose, Transform } from 'class-transformer';
import { BaseViewDto } from '@/core/dto/base.dto';
import { EState } from '@/core/enums';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EUserRole } from '../user-role/user-role.enum';
import { value2Enum } from '@/utils';
// import { IsString, Length, Matches } from 'class-validator';

export class UserManageInfoDto extends BaseViewDto {
  @Expose()
  nickName: string;

  @Expose()
  userName: string;

  @Expose()
  @Transform(({ value }) => CryptoUtil.decryptPhone(value))
  phone: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  @Transform(({ obj }) => !!obj.wechatOpenId)
  bindWx: boolean;

  @Expose()
  @Transform(({ obj }) => obj.roles.map((role) => role.roleType))
  roles: string;
}

export class UserManageSetStateDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsEnum(EState, { message: '类型错误' })
  state: EState;
}

export class UserManageQueryDto {
  @IsOptional()
  @IsString()
  nickName: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value2Enum(EState, Number(value)))
  @IsEnum(EState, { message: '类型错误' })
  state: EState;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || null)
  @IsEnum(EUserRole, { message: '角色类型错误' })
  role: EUserRole;
}
