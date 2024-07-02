import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';
import { EResourceType } from './draft.enum';
import { DraftService } from './draft.service';

@Controller('draft')
@Roles(EUserRole.SuperAdmin, EUserRole.Admin)
export class DraftController {
  constructor(private readonly draftService: DraftService) {}
  @Get('getList')
  getList(
    @Query('resourceId') resourceId: string,
    @Query('resourceType') resourceType: EResourceType,
  ) {
    if (resourceId && resourceType) {
      return this.draftService.findDrafts(resourceType, resourceId);
    } else {
      throw new NotFoundException('缺少必要值');
    }
  }
}
