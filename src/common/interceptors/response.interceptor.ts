import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const message = data?.message;
        delete data.message;
        const response: { success: boolean; message: string; data?: any } = {
          success: true,
          message,
        };
        const responseData = data?.data ?? data;
        if (responseData && Object.keys(responseData).length > 0) {
          response.data = responseData;
        }
        return response;
      }),
    );
  }
}
