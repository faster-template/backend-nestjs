import { EDraftType, EResourceType } from './draft.enum';

export class DraftCreateDto {
  resourceType: EResourceType;
  resourceId: string;
  contentJson: string;
  drafType: EDraftType;
}
