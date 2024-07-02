import { IsString, Length } from 'class-validator';
import { EVerifyCodeType } from './verify-code.enum';

export class CreateVerifyCodeDto {
  @Length(11)
  @IsString()
  phone: string;

  @IsString()
  type: EVerifyCodeType;
}

export class VerifyCodeDto extends CreateVerifyCodeDto {
  @Length(6)
  @IsString()
  code: string;
}
