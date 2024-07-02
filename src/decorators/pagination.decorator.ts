// pagination.decorator.ts
import {
  EPaginationOrder,
  PaginationDto,
} from '@/core/repository/base.repository';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const { page, size, order, orderBy } = request.query;
    const pagination = new PaginationDto();
    pagination.page = Number(page) || 1;
    pagination.size = Number(size) || 20;
    pagination.order =
      String(order).toLocaleLowerCase() === 'asc'
        ? EPaginationOrder.ASC
        : EPaginationOrder.DESC;
    pagination.orderBy = orderBy || 'createTime';
    return pagination;
  },
);
