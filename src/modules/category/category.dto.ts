import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  key: string;
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;
  @IsNumber()
  sort: number;
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty()
  id: string;
}

export class ViewCategoryDto {
  id: string;
  name: string;
  key: string;
  description: string;
  parentId?: string | null;
  children?: ViewCategoryDto[] | null;
  sort: number;
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
