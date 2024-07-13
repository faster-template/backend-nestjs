export enum EPaginationOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum EWhereOperator {
  Equal = '=',
  Like = 'LIKE',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  IsNull = 'IS NULL',
  IsNotNull = 'IS NOT NULL',
}

export class whereItem {
  field: string = '';
  operator?: EWhereOperator = EWhereOperator.Equal;
  value?: any = null;
}

export interface IPaginationResult<T> {
  items: T[];
  total: number;
}
export interface IPaginationParams {
  size: number;
  page: number;
  order?: EPaginationOrder;
  orderBy?: string;
}

export interface IPagination extends IPaginationParams {
  where?: whereItem[] | Record<string, unknown>;
}

export class PaginationParamsDto implements IPaginationParams {
  constructor(pagination: IPaginationParams) {
    this.size = pagination.size || 20;
    this.page = pagination.page || 1;
    this.order = pagination.order || EPaginationOrder.DESC;
    this.orderBy = pagination.orderBy || 'createTime';
  }
  size: number;
  page: number;
  order?: EPaginationOrder;
  orderBy?: string;
}

export class PaginationDto extends PaginationParamsDto {
  constructor(pagination: IPagination) {
    super(pagination);
  }
  where?: whereItem[] | Record<string, unknown>;
}
