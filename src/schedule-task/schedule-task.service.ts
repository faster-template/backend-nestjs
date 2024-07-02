import { Inject, Injectable } from '@nestjs/common';
import { VerifyCodeService } from '../modules/verify-code/verify-code.service';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ScheduleTaskService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private verifyCodeService: VerifyCodeService,
  ) {}

  //每天的23点执行一次
  @Cron('0 00 23 * * 1-7')
  async clearExpiredCode(): Promise<void> {
    this.logger.info('清理过期验证码');
    await this.verifyCodeService.clearExpiredCode();
  }
}
