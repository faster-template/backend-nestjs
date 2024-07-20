import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { BaseTreeNodeViewDto } from '@/core/dto/base-tree.dto';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @IsUppercase({ message: 'Key必须全大写' })
  key: string;
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;
  @IsNumber()
  sort: number;

  creatorId?: string;
}
export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {
  @IsNotEmpty()
  id: string;
}

export class CategorySortDto {
  @IsString()
  @IsNotEmpty()
  sourceId: string;
  @IsString()
  @IsNotEmpty()
  targetId: string;
  @IsNumber()
  @IsNotEmpty()
  position: number;
}

export class CategoryViewDto extends BaseTreeNodeViewDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  key: string;

  @Expose()
  icon: string;

  @Expose()
  url: string;

  @Expose()
  description: string;
  @Expose()
  parentId?: string | null;
  @Expose()
  sort: number;
  @Expose()
  @Type(() => CategoryViewDto)
  children: CategoryViewDto[];
}
