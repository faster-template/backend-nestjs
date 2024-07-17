import * as crypto from 'crypto';

export interface encryptedData {
  encrypted: string;
  iv: string;
}
const algorithm = 'aes-256-cbc';
//  生成随机iv
const generateIVStr = (): { ivStr: string; ivBuff: Buffer } => {
  const iv = crypto.randomBytes(16); // 16字节长的iv
  return { ivStr: iv.toString('hex'), ivBuff: iv };
};

const generateEncrypted = (
  text: string,
  keyBuff: Buffer,
  ivBuff: Buffer,
): string => {
  const cipher = crypto.createCipheriv(algorithm, keyBuff, ivBuff);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const generateDecrypted = (
  text: string,
  keyBuff: Buffer,
  ivBuff: Buffer,
): string => {
  const decipher = crypto.createDecipheriv(algorithm, keyBuff, ivBuff);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export class CryptoUtil {
  /**
   * Md5加密
   * @param text 需要转换成Md5的字符串
   * @returns 返回Md5加密后的字符串
   */
  static md5(text: string): string {
    const md5 = crypto.createHash('md5');
    return md5.update(text).digest('hex');
  }
  /**  加密字符串
   * 返回加密结果和iv {encrypted,iv}
   * @param text 需加密的字符串
   * @param useMd5 是否使用Md5将字符串加密后再进行AES加密，默认否
   * @returns
   */
  static encrypt(text: string, useMd5: boolean = false): encryptedData {
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    const { ivBuff, ivStr } = generateIVStr();
    text = useMd5 ? this.md5(text) : text;
    const encrypted = generateEncrypted(text, key, ivBuff);
    return { encrypted, iv: ivStr };
  }
  /**
   * 加密字符串，使用统一IV,仅返回加密结果字符串
   * @param text 需要加密的明文字符串
   * @returns 加密后的密文字符串
   */
  static encryptNoIV(text: string): string {
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    const iv = Buffer.from(process.env.CRYPTO_IV, 'utf8');
    const encrypted = generateEncrypted(text, key, iv);
    return encrypted;
  }
  /**
   * 解密字符串，传入加密后的密文和iv，返回解密结果
   * @param text 需解密的密文字符串
   * @param iv 解密的向量
   * @returns 解密后的明文字符串
   */
  static decrypt(text: string, iv: string): string {
    const ivBuff = Buffer.from(iv, 'hex');
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    return generateDecrypted(text, key, ivBuff);
  }
  /**
   * 解密字符串，传入加密后的密文，返回解密结果。无需传入IV
   * @param text 需解密的密文字符串
   * @returns 解密后的明文字符串
   */
  static decryptNoIV(text: string): string {
    const ivBuff = Buffer.from(process.env.CRYPTO_IV, 'hex');
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    return generateDecrypted(text, key, ivBuff);
  }
  /** 解密手机号，返回完整手机号
   *
   * @param encryptPhone 加密后的手机号
   * @returns 不带星号的完整手机号
   */
  static decryptPhoneFull(encryptPhone: string): string {
    return encryptPhone ? this.decryptNoIV(encryptPhone) : '';
  }

  /** 解密手机号，返回带星号的手机号
   *
   * @param encryptPhone 加密后的手机号
   * @returns 返回带星号的手机号
   */
  static decryptPhone(encryptPhone: string): string {
    const phone = this.decryptPhoneFull(encryptPhone);
    return phone
      ? phone.slice(0, 3) + '****' + phone.slice(7, phone.length)
      : '';
  }

  /**
   * 比较明文是否与密文一致
   * @param text 需要被比较的明文内容
   * @param encrypted 被比较的密文内容
   * @param iv 被比较的密文内容的IV
   * @param useMd5 是否使用Md5加密明文后再进行比较，默认否
   * @returns 返回是否比较成功
   */
  static compare(
    text: string,
    encrypted: string,
    iv: string,
    useMd5: boolean = false,
  ) {
    const decrypted = this.decrypt(encrypted, iv);
    text = useMd5 ? this.md5(text) : text;
    return decrypted === text;
  }
}
