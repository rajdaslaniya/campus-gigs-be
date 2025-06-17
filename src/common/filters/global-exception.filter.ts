import {
  Catch,
  HttpException,
  Logger,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal server error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionRes = exception.getResponse();

      if (typeof exceptionRes === 'object') {
        message = (exceptionRes as any).message || exception.message;
        error = (exceptionRes as any).error || exception.name;
        details = (exceptionRes as any).details || null;
      } else {
        message = exception.message;
        error = exception.name;
      }
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json({
      success: false,
      message,
      error
    });
  }
}
