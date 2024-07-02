import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CryptoUtil } from 'src/utils/crypto.util';
import { CustomException } from '@/exception/custom-exception';
import { BaseDefaultRepository } from '@/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { IWechatUserBaseAuthInfo } from '../wechat-auth/wechat-auth.interface';
import { plainToClass } from 'class-transformer';
import { UserInfoDto, UserModifyAvatar, UserModifyNickName } from './user.dto';
import { EState } from '@/core/enums';

@Injectable()
export class UserService {
  private usersRepository: BaseDefaultRepository<UserEntity>;
  constructor(private dataSource: DataSource) {
    this.usersRepository = new BaseDefaultRepository<UserEntity>(
      dataSource,
      UserEntity,
      'user',
    );
  }

  //#region  获取用户
  /**
   * @param openid
   * @param unionid
   * @returns
   */
  async findOneById(id: string): Promise<UserEntity> {
    if (!id) return null;
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  /** 使用微信获取用户
   *
   * @param openid
   * @param unionid
   * @returns
   */
  findOneByWechat(data: IWechatUserBaseAuthInfo): Promise<UserEntity> {
    const { openid, unionid } = data;
    // TODO: 根据 openid 和 unionid 查询用户信息
    if (!openid && !unionid) return;
    return this.usersRepository.findOne({
      where: [
        {
          wechatOpenId: openid,
        },
        {
          wechatUnionId: unionid,
        },
      ],
      relations: ['roles'],
    });
  }

  /** 使用账号获取用户
   *
   * @param user
   * @returns
   */
  findOneByUserName(userName: string): Promise<UserEntity> {
    if (!userName) return;
    return this.usersRepository.findOne({
      where: {
        userName,
      },
      relations: ['roles'],
    });
  }

  /** 使用手机号获取用户
   *
   * @param phone
   * @returns
   */
  findOneByPhone(phone: string): Promise<UserEntity> {
    if (!phone) return;
    const encodePhone = CryptoUtil.encryptNoIV(phone);
    return this.usersRepository.findOne({
      where: {
        phone: encodePhone,
      },
      relations: ['roles'],
    });
  }
  //#endregion
  //#region ############### 创建用户 ###############
  /**
   * 使用微信创建用户
   */
  async createUserByWechat(
    openid: string,
    unionid: string,
  ): Promise<UserEntity> {
    // TODO: 创建一个用户
    const user = this.usersRepository.create({
      wechatOpenId: openid,
      wechatUnionId: unionid,
    });
    await this.usersRepository.save(user);
    return user;
  }

  /** 使用用户名+密码创建用户
   * 使用用户名+密码创建用户
   * @param userName 用户名
   * @param password 密码
   * @returns
   */
  async createUserByPassword(
    userName: string,
    password: string,
  ): Promise<UserEntity> {
    // 寻找同名
    const sameNameUser = await this.findOneByUserName(userName);
    if (sameNameUser) {
      const encryptedData = CryptoUtil.encrypt(password);
      const passwordEnc = encryptedData.encrypted;
      const passwordSalt = encryptedData.iv;

      // TODO: 创建一个用户
      const user = this.usersRepository.create({
        userName,
        password: passwordEnc,
        passwordSalt,
      });
      await this.usersRepository.save(user);
      return user;
    } else {
      throw new CustomException('用户名已存在');
    }
  }

  /** 使用手机号创建用户
   * 使用手机号创建用户
   * @param phone 手机号
   * @returns user
   */
  async createUserByPhone(phone: string): Promise<UserEntity> {
    const samePhoneUser = await this.findOneByPhone(phone);

    if (samePhoneUser) {
      const { encrypted, iv } = CryptoUtil.encrypt(phone);
      const user = this.usersRepository.create({
        phone: encrypted + '#' + iv,
      });
      await this.usersRepository.save(user);
      return user;
    } else {
      throw new CustomException('手机号已存在');
    }
  }

  //#endregion
  async getInfo(id: string): Promise<UserInfoDto> {
    const user = await this.findOneById(id);
    if (user) {
      return user.Mapper(UserInfoDto);
    } else {
      throw new NotFoundException('用户不存在');
    }
  }

  EntityToDto(user: UserEntity): UserInfoDto {
    return plainToClass(UserInfoDto, user, {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    });
  }

  /**
   *  检测用户是否使用
   * @param user 用户
   * @returns
   */
  IsEnable(user: UserEntity): boolean {
    return user && user.state === EState.Normal;
  }

  async modifyUserName(id: string, userName: string): Promise<void> {
    const user = await this.findOneById(id);
    if (user) {
      if (userName !== user.userName) {
        const sameNameUser = await this.findOneByUserName(userName);
        if (!sameNameUser) {
          user.userName = userName;
          this.usersRepository.save(user);
        } else {
          throw new CustomException({ message: '已有相同用户名账户' });
        }
      } else {
        throw new CustomException({ message: '用户名不能与原用户名相同' });
      }
    } else {
      throw new NotFoundException('用户不存在');
    }
  }
  async modifyPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findOneById(id);
    if (user) {
      if (CryptoUtil.compare(oldPassword, user.password, user.passwordSalt)) {
        const encryptedData = CryptoUtil.encrypt(newPassword);
        const passwordEnc = encryptedData.encrypted;
        const passwordSalt = encryptedData.iv;
        user.password = passwordEnc;
        user.passwordSalt = passwordSalt;
        this.usersRepository.save(user);
      } else {
        throw new CustomException({ message: '旧密码错误' });
      }
    } else {
      throw new NotFoundException('用户不存在');
    }
  }

  async modifyUserInfo(
    id: string,
    updateInfo: Partial<UserModifyNickName & UserModifyAvatar>,
  ): Promise<void> {
    const user = await this.findOneById(id);
    if (user) {
      Object.keys(updateInfo).forEach((key) => {
        if (user.hasOwnProperty(key)) {
          user[key] = updateInfo[key];
        }
      });
      this.usersRepository.save(user);
    } else {
      throw new NotFoundException('用户不存在');
    }
  }
}
