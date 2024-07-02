import { EOssType } from '@/modules/material/material.enum';
import { QiNiuOssService } from './qiniu.oss.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface OssUploadOption {
  fileName: string;
  folderPath: string;
}

export interface OssUploadResult {
  pathPrefix: string;
  path: string;
}

export interface IOssService {
  upload(file: Buffer, uploadOption: OssUploadOption): Promise<OssUploadResult>;
}

@Injectable()
export class OssService {
  private instances: Map<EOssType, IOssService>;
  constructor(private configService: ConfigService) {
    this.instances = new Map([
      [EOssType.QINIU, new QiNiuOssService(configService)],
    ]);
  }

  handler(type: EOssType): IOssService | undefined {
    return this.instances.get(type);
  }
  getDomain(type: EOssType) {
    return this.configService.get<string>(`OSS_${type.toUpperCase()}_DOMAIN`);
  }
}
