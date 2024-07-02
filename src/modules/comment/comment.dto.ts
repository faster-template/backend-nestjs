import { DOMPurifyTransform } from '@/decorators/DOMPurify.transform.decorator';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ECommentRelationType } from './comment.enum';

export class CommentQueryDto {
  @IsNotEmpty()
  relationId: string;

  @IsNotEmpty()
  relationType: ECommentRelationType;
}

export class CreateArticleDto extends PartialType(CommentQueryDto) {
  @IsOptional()
  @Length(36)
  @IsString()
  id?: string;
}
