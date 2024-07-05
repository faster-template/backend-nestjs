import { BaseWithCreatorViewDto } from '@/core/dto/base.dto';
import { EDraftType, EResourceType } from './draft.enum';
import { Expose } from 'class-transformer';
export class DraftCreateDto {
  resourceType: EResourceType;
  resourceId: string;
  contentJson: string;
  drafType: EDraftType;
}

export class DraftViewDto extends BaseWithCreatorViewDto {
  @Expose()
  contentJson: string;
  @Expose()
  draftType: EDraftType;
}
