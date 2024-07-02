import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { MaterialEntity } from './material.entity';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OssService } from '../upload/oss/oss.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialEntity, BaseDefaultRepository])],
  controllers: [MaterialController],
  providers: [MaterialService, OssService],
  exports: [MaterialService, TypeOrmModule],
})
export class MaterialModule {}
