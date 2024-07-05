import { BaseWithCreatorViewDto } from '@/core/dto/base.dto';
import { DOMPurifyTransform } from '@/decorators/DOMPurify.transform.decorator';
import { PartialType, PickType } from '@nestjs/swagger';
import { Transform, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CategoryViewDto } from '../category/category.dto';
import { UserInfoDto } from '../user/user.dto';

export class ArticleCreateDto {
  @IsNotEmpty()
  @Length(5, 30)
  title: string;

  @Length(5, 8000)
  @IsNotEmpty()
  @Transform(DOMPurifyTransform())
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

@Expose()
export class ArticleViewDto extends BaseWithCreatorViewDto {
  @Expose()
  content: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => PickType(UserInfoDto, ['userName', 'nickName']))
  creator: UserInfoDto;

  @Expose()
  @Type(() => PickType(CategoryViewDto, ['name', 'id']))
  category: CategoryViewDto;
}
