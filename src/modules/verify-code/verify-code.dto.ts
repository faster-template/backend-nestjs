import { IsString, Length } from 'class-validator';
import { EVerifyCodeType } from './verify-code.enum';

export class VerifyCodeCreateDto {
  @Length(11)
  @IsString()
  phone: string;

  @IsString()
  type: EVerifyCodeType;
}

export class VerifyCodeValidDto extends VerifyCodeCreateDto {
  @Length(6)
  @IsString()
  code: string;
}
