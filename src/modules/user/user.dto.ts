import { CryptoUtil } from 'src/utils/crypto.util';
import { Expose, Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import {
  RegNickName,
  RegPassword,
  RegPhone,
  RegUrl,
  RegUserName,
} from '@/const';
import { SensitiveValid } from '@/decorators/sensitive.validator.decorator';

export class UserInfoDto {
  @Expose()
  id: string;

  @Expose()
  nickName: string;

  @Expose()
  userName: string;

  @Expose()
  @Transform(({ value }) => CryptoUtil.decryptPhone(value))
  phone: string;

  @Expose()
  avatarUrl: string;
}

export class UserModifyPwdDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @Matches(RegPassword.match, { message: RegPassword.message })
  newPassword: string;
}

export class UserModifyPhoneDto {
  @IsString()
  @Matches(RegPhone.match, { message: RegPhone.message })
  newPhone: string;

  @IsString()
  @Matches(RegPhone.match, { message: RegPhone.message })
  oldPhone: string;

  @IsString()
  @Length(4, 6, { message: '验证码格式错误' })
  code: string;
}

export class UserModifyNickName {
  @IsString()
  @Matches(RegNickName.match, { message: RegNickName.message })
  @SensitiveValid({ message: '昵称不能包含敏感词' })
  nickName: string;
}

export class UserModifyUserName {
  @IsString()
  @Matches(RegUserName.match, { message: RegUserName.message })
  userName: string;
}

export class UserModifyAvatar {
  @IsString()
  @Matches(RegUrl.match, { message: RegUrl.message })
  avatarUrl: string;
}

export default null;
