import { EState } from '../enums';
import { Type, Expose, Transform } from 'class-transformer';
import { DateTimeTransform } from '@/decorators/datetime.transform.decorator';
import { UserInfoDto } from '@/modules/user/user.dto';

export class BaseViewDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(DateTimeTransform())
  createTime: Date;

  @Transform(DateTimeTransform())
  @Expose()
  updateTime: Date;

  @Expose()
  state: EState;
}

export class BaseWithCreatorViewDto extends BaseViewDto {
  @Expose()
  @Type(() => UserInfoDto)
  creator: UserInfoDto;
}
