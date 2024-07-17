import { Controller, Post, Req } from '@nestjs/common';
import { UploadOption, UploadService } from './upload.service';
import { FastifyRequest } from 'fastify';
import { value2Enum } from '@/utils';
import { EFolder, EOssType } from '../material/material.enum';
import { Roles } from '../user-role/user-role.decorator';
import { EUserRole } from '../user-role/user-role.enum';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  async uploadFile(@Req() req: FastifyRequest) {
    const file = req.body['file'];
    // 进行文件保存等操作
    const result = await this.uploadService.upload(
      file,
      await this.generateOption(req),
    );
    return `${result.pathPrefix}/${result.path}`;
  }

  @Post('files')
  @Roles(EUserRole.SuperAdmin)
  async uploadFiles(@Req() req: FastifyRequest) {
    const files = Object.values(req.body).filter(
      (item) => item.type === 'file',
    );
    // 进行文件保存等操作
    const results = await this.uploadService.uploadBatch(
      files,
      await this.generateOption(req),
    );
    return results.map((result) => {
      return `${result.pathPrefix}/${result.path}`;
    });
  }

  @Post('avatar')
  async uploadAvatar(@Req() req: FastifyRequest) {
    const file = req.body['file'];
    // 进行文件保存等操作
    const result = await this.uploadService.upload(file, {
      folder: EFolder.AVATAR,
      resize: {
        width: 400,
        height: 400,
        fit: 'cover',
        position: 'center',
      },
      quality: 80,
    });
    return `${result.pathPrefix}/${result.path}`;
  }

  private async generateOption(req: FastifyRequest): Promise<UploadOption> {
    const option: UploadOption = {
      noRandomFileName: false,
    };
    if (req.body['noRandomFileName']) {
      option.noRandomFileName = !!req.body['noRandomFileName'].value;
    }
    if (req.body['folder']) {
      option.folder = req.body['folder'].value || null;
    }
    if (req.body['width'] || req.body['height']) {
      option.resize = {};
      if (req.body['width']) {
        option.resize.width = Math.max(
          Math.min(parseInt(req.body['width'].value), 1920),
          100,
        );
      }
      if (req.body['height']) {
        option.resize.width = Math.max(
          Math.min(parseInt(req.body['height'].value), 1080),
          100,
        );
      }
    }
    // quality 只允许30-100 。默认80
    if (req.body['quality']) {
      option.quality =
        Math.max(Math.min(parseInt(req.body['quality'].value), 30), 100) || 80;
    }
    //  允许上传时根据请求配置上传到不同的oss
    if (req.body['oss']) {
      option.oss = value2Enum(EOssType, req.body['oss'].value);
    }

    return option;
  }
}
