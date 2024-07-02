import { IsEnum, IsNotEmpty } from 'class-validator';
import { ELikeRelationType, ELikeType } from './like.enum';
import { OmitType, PartialType } from '@nestjs/swagger';
export class LikeAddDto {
  @IsNotEmpty()
  relationId: string;

  @IsNotEmpty()
  @IsEnum(ELikeRelationType)
  relationType: ELikeRelationType;

  @IsNotEmpty()
  @IsEnum(ELikeType)
  likeType: ELikeType;
}

export class LikeQueryDto extends PartialType(LikeAddDto) {}

export class LikeDeleteDto extends OmitType(LikeAddDto, ['likeType']) {}

export class LikeCountViewDto {
  likeCount: number;
  dislikeCount: number;
  myLikeType: ELikeType | null;
}
