import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '@/exception/custom-exception';
import { IOssService, OssUploadOption, OssUploadResult } from './oss.service';

@Injectable()
export class QiNiuOssService implements IOssService {
  private accessKey: string;
  private secretKey: string;
  private bucket: string;
  private domain: string;
  public OSSNAME = 'QINIU';

  constructor(private configService: ConfigService) {
    this.accessKey = this.configService.get<string>(`OSS_${this.OSSNAME}_AK`);
    this.secretKey = this.configService.get<string>(`OSS_${this.OSSNAME}_SK`);
    this.bucket = this.configService.get<string>(`OSS_${this.OSSNAME}_BUCKET`);
    this.domain = this.configService.get<string>(`OSS_${this.OSSNAME}_DOMAIN`);
  }

  async upload(
    file: Buffer,
    uploadOption: OssUploadOption,
  ): Promise<OssUploadResult> {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const options = {
      scope: this.bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    // 七牛的config.zone已启用
    // config.zone = qiniu.zone.Zone_z2; // 根据你存储空间所在的区域选择合适的 Zone

    config.regionsProvider = qiniu.httpc.Region.fromRegionId('z2');
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    const { fileName, folderPath } = uploadOption;
    const filename = `${folderPath || ''}${folderPath && !folderPath.endsWith('/') ? '/' : ''}${fileName}`;
    return new Promise((resolve, reject) => {
      formUploader
        .put(uploadToken, filename, file, putExtra)
        .then(({ data, resp }) => {
          if (resp.statusCode === 200) {
            resolve({
              pathPrefix: this.domain,
              path: data.key,
            });
          } else {
            reject();
            throw new CustomException('上传失败');
          }
        })
        .catch(() => {
          reject();
          throw new CustomException('上传失败');
        });
    });
  }
}
