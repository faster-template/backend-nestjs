import { Injectable } from '@nestjs/common';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { VerifyCodeEntity } from './verify-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtil } from '@/utils/crypto.util';
import { CustomException } from '@/exception/custom-exception';
import { ConfigService } from '@nestjs/config';
import { CreateVerifyCodeDto, VerifyCodeDto } from './verify-code.dto';

@Injectable()
export class VerifyCodeService {
  constructor(
    @InjectRepository(VerifyCodeEntity)
    private verifyCodeRepository: Repository<VerifyCodeEntity>,
    private configService: ConfigService,
  ) {}
  // 验证码有效时间，5分钟
  private limitDateTime = 5 * 60 * 1000;
  // 验证码发送间隔时间
  private limitInterval = 1 * 60 * 1000;

  async create(data: CreateVerifyCodeDto): Promise<void> {
    const { phone, type } = data;
    if (!phone || !type) {
      throw new CustomException('手机号不能为空');
    }
    const encryptedPhone = CryptoUtil.encryptNoIV(phone);
    const history = await this.verifyCodeRepository.find({
      where: {
        type,
        phone: encryptedPhone,
        createTime: MoreThan(new Date(Date.now() - this.limitInterval)),
      },
    });
    if (history && history.length > 0) {
      throw new CustomException('发送验证码过于频繁，请稍后再试');
    }
    // 生成随机6位数验证码,开发环境改成123456
    let code = Math.random().toString().slice(-6);
    if (this.configService.get('NODE_ENV') === 'development') {
      code = '123456';
    }
    // TODO : 这里还需要调用具体的短信发送平台或者微信发送平台发送验证码
    const verifyCode = this.verifyCodeRepository.create({
      code,
      phone: encryptedPhone,
    });
    await this.verifyCodeRepository.save(verifyCode);
  }

  async verify(data: VerifyCodeDto): Promise<boolean> {
    const { phone, type, code } = data;
    if (!phone || !code || !type) {
      throw new CustomException('手机号或验证码不能为空');
    }
    if (phone && code) {
      const encryptedPhone = CryptoUtil.encryptNoIV(phone);
      const verifyCode = await this.verifyCodeRepository.findOne({
        where: {
          phone: encryptedPhone,
          createTime: MoreThan(new Date(Date.now() - this.limitDateTime)),
          code,
          type,
        },
      });
      if (verifyCode) {
        this.verifyCodeRepository.remove(verifyCode);
        return true;
      }
      return false;
    } else {
      throw new CustomException('手机号或验证码不能为空');
    }
  }

  async clearExpiredCode(): Promise<void> {
    const expiredCodes = await this.verifyCodeRepository.find({
      where: {
        createTime: LessThan(new Date(Date.now() - this.limitDateTime)),
      },
    });
    this.verifyCodeRepository.remove(expiredCodes);
  }
}
