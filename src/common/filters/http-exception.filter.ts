import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from '../../utils/response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const errorResponse = exception.getResponse();

      // Handle when errorResponse is an object
      if (typeof errorResponse === 'object' && errorResponse !== null) {
        const errorObj = errorResponse as Record<string, unknown>;
        message = (errorObj.message as string) || JSON.stringify(errorResponse);
      } else {
        message = errorResponse;
      }

      errorType = HttpStatus[code] || 'Error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = ResponseUtil.error(message, code, errorType);

    response.status(code).json(errorResponse);
  }
}
