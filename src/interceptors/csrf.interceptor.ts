import { isLogin } from '@/utils';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify';

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const CSRF_DATA = {};
    const isLoginUrl = isLogin(ctx.getRequest().url);
    if (isLoginUrl) {
      CSRF_DATA[process.env.CSRF_KEY] = response.generateCsrf();
    }
    return next.handle().pipe(map((data) => ({ ...data, ...CSRF_DATA })));
  }
}
