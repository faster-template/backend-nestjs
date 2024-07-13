// pagination.decorator.ts
import {
  EPaginationOrder,
  IPagination,
  PaginationDto,
} from '@/core/repository/base.repository';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPagination => {
    const request = ctx.switchToHttp().getRequest();
    const { page, size, order, orderBy } = request.query;
    const pagination = new PaginationDto({
      page: Number(page),
      size: Number(size),
      order:
        String(order).toLocaleLowerCase() === 'asc'
          ? EPaginationOrder.ASC
          : EPaginationOrder.DESC,
      orderBy,
    });

    return pagination;
  },
);
