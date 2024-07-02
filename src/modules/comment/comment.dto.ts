import { DOMPurifyTransform } from '@/decorators/DOMPurify.transform.decorator';
import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ECommentRelationType } from './comment.enum';
import { Transform } from 'class-transformer';
export class CommentQueryDto {
  @IsNotEmpty()
  relationId: string;

  @IsNotEmpty()
  @IsEnum(ECommentRelationType)
  relationType: ECommentRelationType;
}

export class CommentCreateDto extends PartialType(CommentQueryDto) {
  @IsNotEmpty()
  @Length(1, 200)
  @Transform(DOMPurifyTransform)
  content: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;
}
