import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EFolder, EMaterialType, EOssType } from './material.enum';

import { Expose, Transform } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { BaseWithCreatorViewDto } from '@/core/dto/base.dto';
import { EState } from '@/core/enums';
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
  @IsEnum(EFolder, { message: '素材存放位置错误' })
  folder: EFolder;

  @IsNumber()
  @Transform(({ value }) => value || EState.Disable)
  @IsEnum(EState, { message: '请先设置state' })
  state: EState;
}

export class MaterialViewDto extends PickType(BaseWithCreatorViewDto, [
  'id',
  'createTime',
]) {
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
