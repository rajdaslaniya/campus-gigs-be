import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    
    if (exception.code === 11000) {
      return response.status(409).json({
        statusCode: 409,
        message: 'Duplicate key error',
        error: 'Conflict',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Database error',
    });
  }
}