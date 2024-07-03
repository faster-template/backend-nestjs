import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EMaterialType, EOssType } from './material.enum';

import { Expose } from 'class-transformer';
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

  @IsString()
  name: string;

  @IsString()
  folder: string;
}

export class MaterialViewDto {
  @Expose()
  id: string;
  @Expose()
  type: EMaterialType;
  @Expose()
  ossType: EOssType;
  @Expose()
  path: string;
  @Expose()
  name: string;
  @Expose()
  folder: string;
}
