import { Module } from '@nestjs/common';
import { VerifyCodeService } from './verify-code.service';
import { VerifyCodeController } from './verify-code.controller';
import { VerifyCodeEntity } from './verify-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VerifyCodeEntity])],
  controllers: [VerifyCodeController],
  providers: [VerifyCodeService],
  exports: [VerifyCodeService, TypeOrmModule],
})
export class VerifyCodeModule {}
