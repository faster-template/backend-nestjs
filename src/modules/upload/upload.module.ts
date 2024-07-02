import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { OssService } from './oss/oss.service';
import { MaterialService } from '../material/material.service';

@Module({
  providers: [UploadService, OssService, MaterialService],
  exports: [UploadService, OssService, MaterialService],
  controllers: [UploadController],
})
export class UploadModule {}
