// pagination.decorator.ts

import {
  IPaginationParams,
  EPaginationOrder,
  PaginationParamsDto,
} from '@/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPaginationParams => {
    const request = ctx.switchToHttp().getRequest();
    const { page, size, order, orderBy } = request.query;
    const pagination = new PaginationParamsDto({
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
