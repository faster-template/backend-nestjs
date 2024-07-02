import { IsEnum, IsNotEmpty } from 'class-validator';
import { ELikeRelationType, ELikeType } from './like.enum';
import { PartialType } from '@nestjs/swagger';
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

export class LikeDelDto extends PartialType(LikeAddDto) {}
