import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const messages = this.flattenValidationErrors(exception);

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: messages,
    });
  }

  private flattenValidationErrors(error: ValidationError): string[] {
    const messages: string[] = [];
    
    for (const constraint in error.constraints) {
      if (error.constraints[constraint]) {
        messages.push(error.constraints[constraint]);
      }
    }
    
    return messages;
  }
}