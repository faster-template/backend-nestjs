import { BaseWithCreatorViewDto } from './base.dto';
import { Expose } from 'class-transformer';

export interface BaseTreeNodeDto {
  id?: string | null;
  parentId?: string | null;
  children?: BaseTreeNodeDto[] | null;
}

export class BaseTreeNodeViewDto extends BaseWithCreatorViewDto {
  @Expose()
  sort: number;
}
