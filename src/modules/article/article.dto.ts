import { DOMPurifyTransform } from '@/decorators/DOMPurify.transform.decorator';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ArticleCreateDto {
  @IsNotEmpty()
  @Length(5, 30)
  title: string;

  @Length(5, 8000)
  @IsNotEmpty()
  @Transform(DOMPurifyTransform)
  content: string;

  @IsNotEmpty()
  categoryId: string;
  creatorId?: string;
}

export class ArticleUpdateDto extends PartialType(ArticleCreateDto) {
  @IsOptional()
  @Length(36)
  @IsString()
  id?: string;
}
