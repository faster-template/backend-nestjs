import { CryptoUtil } from 'src/utils/crypto.util';
import { Expose, Transform } from 'class-transformer';
import { BaseViewDto } from '@/core/dto/base.dto';
import { EState } from '@/core/enums';
import { IsEnum, IsNumber, IsString } from 'class-validator';
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
