import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResponseData } from './response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponseData> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        code: 200,
        data,
      })),
      catchError((error) => {
        // 直接抛出异常，用error.filter处理
        throw error;
      }),
    );
  }
}
