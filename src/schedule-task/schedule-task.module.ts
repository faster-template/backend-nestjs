import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './schedule-task.service';
import { VerifyCodeModule } from '../modules/verify-code/verify-code.module';

@Module({
  imports: [VerifyCodeModule],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
