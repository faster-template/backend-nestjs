import { BaseEntity } from 'typeorm';
import {
  ClassTransformOptions,
  plainToClass,
  ClassConstructor,
} from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggerProxy } from '@/common/logger.proxy';
export interface AutoMapperItem {
  mapperToClass: ClassConstructor;
  options: ClassTransformOptions;
}
// 参考配置
// https://github.com/typestack/class-transformer/blob/a073b5ea218dd4da9325fe980f15c1538980500e/src/interfaces/class-transformer-options.interface.ts#L8
// ClassTransformOptions
// strategy: 排除策略。默认情况下使用exposeAll，这意味着默认情况下将公开所有属性进行转换。
// excludeExtraneousValues: 指示在将普通值转换为类时是否应排除多余的属性。此选项要求目标类的每个属性至少有一个来自该库的@Expose或@Exclude装饰器。
// groups: 只有具有给定分组的属性才会被转换。
// version: 只有具有"since" > version < "until"的属性才会被转换。
// excludePrefixes: 排除具有给定前缀的属性。例如，如果您使用""和"__"标记私有属性，可以将此选项的值设置为["", "__"]，这样所有私有属性都将被跳过。这仅适用于"exposeAll"策略。
// ignoreDecorators: 如果设置为true，则类转换器将忽略所有@Expose和@Exclude装饰器的影响。如果您想克隆对象但不应用装饰器的影响，这个选项很有用。注意：您可能仍然需要添加装饰器以使其他选项起作用。
// targetMaps: 目标映射允许设置转换对象的类型，而无需使用@Type装饰器。当您转换外部类或已经具有对象的类型元数据且不想再次设置它时，这很有用。
// enableCircularCheck: 如果设置为true，则类转换器将执行循环检查（默认情况下关闭循环检查）。当您确定类型可能存在循环依赖关系时，此选项很有用。
// enableImplicitConversion: 如果设置为true，则类转换器将根据其类型信息隐式地尝试将属性转换为目标类型。默认值为false。
// exposeDefaultValues: 如果设置为true，则类转换器将为未提供的字段使用默认值。当您将普通对象转换为类并具有具有默认值的可选字段时，这很有用。
// exposeUnsetFields: 当设置为true时，值为undefined的字段将包含在类到普通转换中。否则，这些字段将从结果中省略。默认值为true。
const defaultTransformOptions: ClassTransformOptions = {
  strategy: 'exposeAll',
  excludeExtraneousValues: true,
  //   ignoreDecorators: true,
  excludePrefixes: ['_'],
  enableCircularCheck: true,
  enableImplicitConversion: true,
  exposeUnsetFields: false,
  exposeDefaultValues: false,
};

// 自动mapper
// 提供给仓储服务
@Injectable()
export class AutoMapper {
  private static mappers: Map<ClassConstructor<BaseEntity>, AutoMapperItem> =
    new Map();

  @Inject(WINSTON_MODULE_PROVIDER)
  private static readonly logger: Logger;

  static addMapper<T>(
    entityClass: ClassConstructor<BaseEntity>,
    mapperToClass: ClassConstructor<T>,
    options?: ClassTransformOptions,
  ) {
    this.mappers.set(entityClass, {
      mapperToClass,
      options: options || defaultTransformOptions,
    });
  }

  static getMapper<T extends BaseEntity>(
    entity: T | T[],
  ): AutoMapperItem | undefined {
    let entityContructor = entity.constructor;
    if (Array.isArray(entity)) {
      entityContructor = entity[0].constructor;
    }
    return this.mappers.get(entityContructor);
  }
  static MapperTo<T extends BaseEntity>(
    entity: T | T[],
    targetMapper?: ClassConstructor,
    options?: ClassTransformOptions,
  ): ClassConstructor | ClassConstructor[] | T | T[] {
    if (!targetMapper) {
      if (!entity || (Array.isArray(entity) && entity.length == 0))
        return entity;
      const mapper = this.getMapper(entity);
      if (mapper) {
        targetMapper = mapper.mapperToClass;
        options = mapper.options;
      } else {
        return entity;
      }
    }
    options = options || defaultTransformOptions;
    try {
      return plainToClass(targetMapper, entity, options);
    } catch (exception) {
      LoggerProxy.error('AutoMapper-Error', exception);
      return entity;
    }
  }
}
