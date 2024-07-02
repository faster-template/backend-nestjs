import { IsEnum, IsNotEmpty } from 'class-validator';
import { ELikeRelationType, ELikeType } from './like.enum';
import { PartialType, PickType } from '@nestjs/swagger';
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

export class LikeQueryDto extends PickType(LikeAddDto, [
  'relationId',
  'relationType',
]) {}

export class LikeDelDto extends PartialType(LikeAddDto) {}

export class LikeCountViewDto {
  likeCount: number;
  dislikeCount: number;
  myLikeType: ELikeType | null;
}
