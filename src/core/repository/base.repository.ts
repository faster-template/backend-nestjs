import { EState } from '@/core/enums';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { AutoMapper } from '../auto-mapper';
import { BaseDefaultEntity } from '../entities/base.entity';
import {
  EWhereOperator,
  IPagination,
  IPaginationResult,
  whereItem,
} from '@/types';

export interface QueryOption<T> {
  onlyQueryBuilder?: boolean;
  queryBuilder?: SelectQueryBuilder<T>;
}

export const defaultQueryOption = {
  onlyQueryBuilder: false,
  queryBuilder: null,
};

export class BaseDefaultRepository<
  T extends BaseDefaultEntity,
> extends Repository<T> {
  constructor(
    private dataSource: DataSource,
    private entity: EntityTarget<T>,
    private alias: string,
  ) {
    super(entity, dataSource.manager);
  }

  /** 分页查询
   * 分页查询
   * @param pagination 分页参数
   * @param onlyQueryBuilder 仅输出QueryBuilder而不是结果
   * @param queryBuilder  自定义QueryBuilder
   * @returns
   */
  async paginate(
    pagination: IPagination,
    option: QueryOption<T> = defaultQueryOption,
  ): Promise<IPaginationResult<T> | SelectQueryBuilder<T>> {
    const { size, page: num, order, orderBy: sort, where } = pagination;
    let { queryBuilder } = option;
    const { onlyQueryBuilder } = option;
    if (!queryBuilder) {
      queryBuilder = this.createQueryBuilder(this.alias);
    }
    if (where) {
      this.where(where, { queryBuilder, onlyQueryBuilder: true });
    }
    queryBuilder.skip((num - 1) * size).take(size);

    if (sort) {
      queryBuilder.orderBy(`${queryBuilder.alias}.${sort}`, order);
    }
    if (onlyQueryBuilder) {
      return queryBuilder;
    }

    const [items, total] = await queryBuilder.printSql().getManyAndCount();

    return {
      items,
      total,
    };
  }

  async where(
    where: whereItem[] | Record<string, unknown>,
    option: QueryOption<T> = defaultQueryOption,
  ): Promise<T[] | SelectQueryBuilder<T>> {
    let { queryBuilder } = option;
    const { onlyQueryBuilder } = option;
    if (!queryBuilder) {
      queryBuilder = this.createQueryBuilder(this.alias);
    }

    if (!Array.isArray(where)) {
      where = Object.keys(where).map((key) => {
        return {
          field: key,
          value: where[key],
          operator: EWhereOperator.Equal,
        };
      });
    }
    where.forEach((item) => {
      const needValueOperators = [
        null,
        undefined,
        EWhereOperator.Equal,
        EWhereOperator.Like,
        EWhereOperator.GreaterThan,
        EWhereOperator.GreaterThanOrEqual,
        EWhereOperator.LessThan,
        EWhereOperator.LessThanOrEqual,
      ];
      if (needValueOperators.includes(item.operator)) {
        item.value &&
          queryBuilder.andWhere(
            `${queryBuilder.alias}.${item.field} ${item.operator || EWhereOperator.Equal} :${item.field}`,
            {
              [item.field]: item.value,
            },
          );
      } else {
        queryBuilder.andWhere(
          `${queryBuilder.alias}.${item.field} ${item.operator}`,
        );
      }
    });

    if (onlyQueryBuilder) {
      return queryBuilder;
    } else {
      return queryBuilder.getMany();
    }
  }

  /** 仅查询State 为 EState.Normal的数据
   *
   * @param onlyQueryBuilder 是否仅输出QueryBuilder而不是结果
   * @param queryBuilder 自定义QueryBuilder
   * @returns
   */
  async onlyQueryNormal(
    option: QueryOption<T> = defaultQueryOption,
  ): Promise<T[] | SelectQueryBuilder<T>> {
    let { queryBuilder } = option;
    const { onlyQueryBuilder } = option;
    if (!queryBuilder) {
      queryBuilder = this.createQueryBuilder(this.alias);
    }
    queryBuilder.where(`${this.alias}.state = :state`, {
      state: EState.Normal,
    });
    if (onlyQueryBuilder) {
      return queryBuilder;
    }
    return queryBuilder.getMany();
  }

  async findOneWithMapper(options: FindOneOptions): Promise<T> {
    const result = await this.findOne(options);
    return AutoMapper.MapperTo(result);
  }

  async findWithMapper(options: FindManyOptions): Promise<T[]> {
    const result = await this.find(options);
    return AutoMapper.MapperTo(result);
  }

  async paginateWithMapper(
    pagination: IPagination,
    option: QueryOption<T> = defaultQueryOption,
  ): Promise<IPaginationResult<T> | SelectQueryBuilder<T>> {
    if (option.onlyQueryBuilder) {
      return this.paginate(pagination, option);
    } else {
      const result = (await this.paginate(
        pagination,
        option,
      )) as IPaginationResult<T>;
      return {
        items: AutoMapper.MapperTo(result.items),
        total: result.total,
      };
    }
  }
}
