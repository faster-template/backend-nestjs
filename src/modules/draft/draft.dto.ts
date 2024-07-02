import { EDraftType, EResourceType } from './draft.enum';

export class CreateDraftDto {
  resourceType: EResourceType;
  resourceId: string;
  contentJson: string;
  drafType: EDraftType;
}
