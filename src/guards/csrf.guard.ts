import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const http = context.switchToHttp();
      const request = http.getRequest<FastifyRequest>(),
        response = http.getResponse<FastifyReply>();
      const instance = this.adapterHost.httpAdapter.getInstance();

      instance.csrfProtection(request, response, () => {});

      return true;
    } catch (error) {
      throw error;
    }
  }
}
