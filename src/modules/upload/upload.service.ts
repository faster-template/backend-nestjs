import { MaterialService } from './../material/material.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResizeOptions } from 'sharp';
import { resizeImage } from './handler/image.handler';
import { MultipartFile } from '@fastify/multipart';
import { EOssType } from '../material/material.enum';
import { OssService, OssUploadResult } from './oss/oss.service';
import { ConfigService } from '@nestjs/config';

export interface UploadOption {
  resize?: null | ResizeOptions; // 是否修改图片尺寸
  quality?: number; // 压缩图片的质量
  oss?: EOssType; // 上传到 oss
  fileName?: string; // 文件名称,无需后缀
  fileNameRandom?: boolean; // 是否随机文件名称,在fileName不存在时生效
  folderPath?: string; // 文件夹路径
}

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService,
    private ossService: OssService,
    private materialService: MaterialService,
  ) {}

  async upload(
    file: MultipartFile,
    option: UploadOption = { quality: 80 },
  ): Promise<OssUploadResult> {
    // 尝试压缩图片
    // 判断是否是图片
    let fileBuff: Buffer = await file.toBuffer();
    if (
      file.mimetype.startsWith('image/') &&
      option &&
      (option.resize || option.quality)
    ) {
      fileBuff = await resizeImage(fileBuff, option.resize, option.quality);
    }
    const filename = `${option.fileName || (option.fileNameRandom ? Math.random().toString(36).slice(2) : file.filename.slice(0, file.filename.lastIndexOf('.')))}${file.filename.slice(file.filename.lastIndexOf('.'))}`;

    // 无需关心具体的Oss，直接从ossServicehandler处理，根据请求配置
    const ossService = this.ossService.handler(option.oss || EOssType.QINIU);
    if (!ossService) {
      throw new NotFoundException('未找到OSS服务');
    }
    const uploadResult = await ossService.upload(fileBuff, {
      fileName: filename,
      folderPath: option.folderPath,
    });

    await this.materialService.create({
      ossType: option.oss || EOssType.QINIU,
      path: uploadResult.path,
      type: this.materialService.getTypeByMime(file.mimetype),
    });
    return uploadResult;
  }

  async uploadBatch(
    files: MultipartFile[],
    option: UploadOption = null,
  ): Promise<OssUploadResult[]> {
    const asyncQueue = [];
    for await (const file of files) {
      asyncQueue.push(this.upload(file, option));
    }
    return Promise.all(asyncQueue).then((urls) => urls);
  }
}
