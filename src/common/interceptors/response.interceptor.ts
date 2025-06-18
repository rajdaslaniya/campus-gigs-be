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
        // Extract message and success if they exist
        const { message, success = true, ...rest } = data || {};

        // Return the rest of the data directly with success and message
        return {
          success,
          message:
            message || (success ? 'Operation successful' : 'Operation failed'),
          ...rest,
        };
      }),
    );
  }
}
