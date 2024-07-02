import { Controller, Post, Body } from '@nestjs/common';
import { VerifyCodeService } from './verify-code.service';
import { CreateVerifyCodeDto, VerifyCodeDto } from './verify-code.dto';
@Controller('verify-code')
export class VerifyCodeController {
  constructor(private readonly verifyCodeService: VerifyCodeService) {}

  @Post('send')
  async sendCode(@Body() createDto: CreateVerifyCodeDto) {
    return await this.verifyCodeService.create(createDto);
  }
  @Post('verify')
  async verifyCode(@Body() verifyDto: VerifyCodeDto) {
    return await this.verifyCodeService.verify(verifyDto);
  }
}
