import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EMaterialType, EOssType } from './material.enum';

// export type MaterialCreateDto = Pick<
//   MaterialEntity,
//   'type' | 'ossType' | 'path'
// >;

export class MaterialCreateDto {
  @IsOptional()
  @IsString()
  @IsEnum(EMaterialType, { message: '素材类型错误' })
  type: EMaterialType;

  @IsOptional()
  @IsEnum(EOssType, { message: 'oss未找到' })
  ossType: EOssType;

  @IsString()
  path: string;
}
