import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object' && data !== null && 'data' in data) {
          const { data: innerData, meta, message } = data;
          return {
            success: true,
            message: message || null,
            data: innerData,
            ...(meta && { meta }),
          };
        }
        
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
