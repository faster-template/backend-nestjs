import { OssService } from './../upload/oss/oss.service';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { MaterialCreateDto, MaterialViewDto } from './material.dto';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { MaterialEntity } from './material.entity';
import { REQUEST } from '@nestjs/core';
import { EMaterialType } from './material.enum';
import { IPagination, IPaginationResult } from '@/types';
@Injectable()
export class MaterialService {
  private materialRepository: BaseDefaultRepository<MaterialEntity>;
  constructor(
    private dataSource: DataSource,
    private ossService: OssService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.materialRepository = new BaseDefaultRepository<MaterialEntity>(
      dataSource,
      MaterialEntity,
      'material',
    );
  }

  async create(createMaterialDto: MaterialCreateDto): Promise<MaterialEntity> {
    const { path, ossType } = createMaterialDto;
    const samePathMaterial = await this.materialRepository.findOne({
      where: {
        path,
        ossType,
      },
    });
    if (samePathMaterial) {
      return samePathMaterial;
    }
    const material = this.materialRepository.create(createMaterialDto);
    material.creatorId = this.request['user'].id;
    return this.materialRepository.save(material);
  }

  async getList(
    pagination: IPagination,
  ): Promise<IPaginationResult<MaterialViewDto>> {
    const result = (await this.materialRepository.paginateWithMapper(
      pagination,
    )) as IPaginationResult<MaterialViewDto>;
    result.items.forEach((item) => {
      item.path = `${this.ossService.getDomain(item.ossType)}/${item.path}`;
    });
    return result;
  }

  // 这里需要根据mimetype来判断类型
  // TODO 这里需要优化
  getTypeByMime(mimetype: string): EMaterialType {
    const mimeTypeToType: { [key: string]: EMaterialType } = {
      // 图片
      'image/jpeg': EMaterialType.IMAGE,
      'image/png': EMaterialType.IMAGE,
      'image/gif': EMaterialType.IMAGE,
      'image/bmp': EMaterialType.IMAGE,
      'image/webp': EMaterialType.IMAGE,
      'image/svg+xml': EMaterialType.IMAGE,

      // 视频
      'video/mp4': EMaterialType.VIDEO,
      'video/webm': EMaterialType.VIDEO,
      'video/ogg': EMaterialType.VIDEO,
      'video/quicktime': EMaterialType.VIDEO,
      'video/x-msvideo': EMaterialType.VIDEO,
      'video/x-flv': EMaterialType.VIDEO,

      // 音频
      'audio/mpeg': EMaterialType.AUDIO,
      'audio/ogg': EMaterialType.AUDIO,
      'audio/wav': EMaterialType.AUDIO,
      'audio/webm': EMaterialType.AUDIO,

      // 文档
      'application/pdf': EMaterialType.FILE,
      'application/msword': EMaterialType.FILE,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        EMaterialType.FILE,
      'application/vnd.ms-excel': EMaterialType.FILE,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        EMaterialType.FILE,
      'application/vnd.ms-powerpoint': EMaterialType.FILE,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        EMaterialType.FILE,
      'text/plain': EMaterialType.FILE,

      // 压缩包
      'application/zip': EMaterialType.FILE,
      'application/x-rar-compressed': EMaterialType.FILE,
      'application/x-7z-compressed': EMaterialType.FILE,
    };

    return mimeTypeToType[mimetype] || EMaterialType.OTHER;
  }
}
