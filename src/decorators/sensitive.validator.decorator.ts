import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import SensitiveWordTool from 'sensitive-word-tool';

// 单例模式 - SensitiveWordTool
// 防止每次验证都需要重新实例化
class SingleSensitiveWordValidator {
  private static instance: SensitiveWordTool;
  // 私有构造函数，防止外部实例化
  private constructor() {}
  public static getInstance(option: any): SensitiveWordTool {
    if (!SingleSensitiveWordValidator.instance) {
      SingleSensitiveWordValidator.instance = new SensitiveWordTool(option);
    }
    return SingleSensitiveWordValidator.instance;
  }
}

@ValidatorConstraint({ async: false })
export class IsSensitiveConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    const sensitiveWordTool = SingleSensitiveWordValidator.getInstance({
      useDefaultWords: true, // 初始化时使用默认敏感词
    });
    return !sensitiveWordTool.verify(text); // 如果包含敏感词，则验证失败
  }
  defaultMessage() {
    return '输入内容包含敏感词汇，请修改后再提交。';
  }
}

export function SensitiveValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'SensitiveValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSensitiveConstraint,
    });
  };
}
