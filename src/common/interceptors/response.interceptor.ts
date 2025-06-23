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
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        const responseData: any = {
          success: true,
          status: statusCode,
        };

        if (typeof data === 'object' && data !== null) {
          if ('data' in data) {
            const { data: innerData, meta, message, status, ...rest } = data;
            responseData.data = innerData;
            responseData.message = message || null;
            if (meta) responseData.meta = meta;
            if (status) responseData.status = status;
            // Include any additional properties
            Object.assign(responseData, rest);
          } else {
            responseData.data = data;
          }
        } else {
          responseData.data = data;
        }

        return responseData;
      }),
    );
  }
}
