import { IsEnum, IsString, Length } from 'class-validator';
import { EVerifyCodeType } from './verify-code.enum';

export class VerifyCodeCreateDto {
  @Length(11)
  @IsString()
  phone: string;

  @IsString()
  @IsEnum(EVerifyCodeType, { message: '类型错误' })
  type: EVerifyCodeType;
}

export class VerifyCodeValidDto extends VerifyCodeCreateDto {
  @Length(6)
  @IsString()
  code: string;
}
