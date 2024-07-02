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
  static compare(text: string, encrypted: string, iv: string) {
    const decrypted = this.decrypt(encrypted, iv);
    return decrypted === text;
  }
  static encrypt(text: string): encryptedData {
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    const { ivBuff, ivStr } = generateIVStr();
    const encrypted = generateEncrypted(text, key, ivBuff);
    return { encrypted, iv: ivStr };
  }

  static decrypt(text: string, iv: string): string {
    const ivBuff = Buffer.from(iv, 'hex');
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    return generateDecrypted(text, key, ivBuff);
  }

  static encryptNoIV(text: string): string {
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    const iv = Buffer.from(process.env.CRYPTO_IV, 'utf8');
    const encrypted = generateEncrypted(text, key, iv);
    return encrypted;
  }

  static decryptNoIV(text: string): string {
    const ivBuff = Buffer.from(process.env.CRYPTO_IV, 'hex');
    const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
    return generateDecrypted(text, key, ivBuff);
  }
  /** 解密手机号，返回完整解密结果
   *
   * @param encryptPhone 加密后的手机号
   * @returns 不带星号的完整手机号
   */
  static decryptPhoneFull(encryptPhone: string): string {
    return encryptPhone ? this.decryptNoIV(encryptPhone) : '';
  }

  /** 解密手机号，但返回未完全脱敏手机号
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
}
