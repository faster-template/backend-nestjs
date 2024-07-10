import { DOMPurifyTransform } from '@/decorators/DOMPurify.transform.decorator';
import { OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ECommentRelationType } from './comment.enum';
import { Type, Expose, Transform } from 'class-transformer';
import { UserInfoDto } from '../user/user.dto';
import { TimeAgoTransform } from '@/decorators/timeago.transform.decorator';
import { EState } from '@/core/enums';

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
  @Transform(DOMPurifyTransform({ ALLOWED_TAGS: [] }))
  content: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;
}

export class CommentViewDto {
  @Expose()
  id: string;
  @Expose()
  state: EState;

  @Expose()
  content: string;

  @Expose()
  @Transform(TimeAgoTransform())
  createTime: Date;

  @Expose()
  @Type(() => UserInfoDto)
  creator: UserInfoDto;

  @Expose()
  @Type(() => CommentViewDto)
  children: CommentViewDto[];
}

export class CommentListViewDto {
  @Expose()
  items: CommentViewDto[];
  @Expose()
  total: number;
}

export class CommentCreateSuccessViewDto extends OmitType(CommentViewDto, [
  'children',
]) {}
