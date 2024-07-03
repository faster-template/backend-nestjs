import { MaterialService } from './../material/material.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResizeOptions } from 'sharp';
import { resizeImage } from './handler/image.handler';
import { MultipartFile } from '@fastify/multipart';
import { EOssType } from '../material/material.enum';
import { OssService, OssUploadResult } from './oss/oss.service';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '@/exception/custom-exception';

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
    if (!limitFileMimeTypes.includes(file.mimetype)) {
      throw new CustomException('不支持的文件类型');
    }
    if (
      file.mimetype.startsWith('image/') &&
      option &&
      (option.resize || option.quality)
    ) {
      fileBuff = await resizeImage(fileBuff, option.resize, option.quality);
    }
    const sourceFileName = file.filename.slice(
      0,
      file.filename.lastIndexOf('.'),
    );
    const sourceFileExt = file.filename.slice(file.filename.lastIndexOf('.'));
    const filename = `${option.fileName || (option.fileNameRandom ? Math.random().toString(36).slice(2) : sourceFileName)}${sourceFileExt}`;

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
      folder: option.folderPath || '/',
      name: filename || sourceFileName,
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

const limitFileMimeTypes = [
  // 图片
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  // 视频
  'video/mp4',
  'video/x-flv',
  'video/ogg',
  'video/webm',
  // 音频
  'audio/mpeg',
  'audio/ogg',
  // 文档
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/pdf',
  'text/plain',
];
