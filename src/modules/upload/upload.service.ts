import { MaterialService } from './../material/material.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResizeOptions } from 'sharp';
import { resizeImage } from './handler/image.handler';
import { MultipartFile } from '@fastify/multipart';
import { EFolder, EOssType } from '../material/material.enum';
import { OssService, OssUploadResult } from './oss/oss.service';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '@/exception/custom-exception';
import { value2Enum } from '@/utils';
import { acceptTypes } from './upload.type';
import { EState } from '@/core/enums';
export interface UploadOption {
  resize?: null | ResizeOptions; // 是否修改图片尺寸
  quality?: number; // 压缩图片的质量
  oss?: EOssType; // 上传到 oss
  fileName?: string; // 文件名称,无需后缀
  noRandomFileName?: boolean; // 是否随机文件名称,在fileName不存在时生效
  folder?: EFolder; // 文件夹路径
  materialState?: EState;
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
    let fileBuff: Buffer = await file.toBuffer();
    // 检测文件类型
    if (!acceptTypes.includes(file.mimetype)) {
      throw new CustomException('不支持的文件类型');
    }
    // 检测上传文件夹，强制限制只能将文件存放在限制的文件夹内
    const folder = value2Enum(EFolder, option.folder);
    if (!folder) {
      throw new NotFoundException('文件夹路径错误');
    }
    // 压缩图片
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
    const filename = `${option.fileName || (option.noRandomFileName ? sourceFileName : Math.random().toString(36).slice(2))}${sourceFileExt}`;

    // 无需关心具体的Oss，直接从ossServicehandler处理，根据请求配置
    const ossService = this.ossService.handler(option.oss || EOssType.QINIU);
    if (!ossService) {
      throw new NotFoundException('未找到OSS服务');
    }
    const uploadResult = await ossService.upload(fileBuff, {
      fileName: filename,
      folder: option.folder,
    });

    await this.materialService.create({
      ossType: option.oss || EOssType.QINIU,
      folder,
      name: filename || sourceFileName,
      path: uploadResult.path,
      type: this.materialService.getTypeByMime(file.mimetype),
      state: option.materialState,
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
