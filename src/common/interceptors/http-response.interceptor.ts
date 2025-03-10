import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ErrorResponse,
  ResponseUtil,
  SuccessResponse,
} from '../../utils/response.util';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response: Response = context
          .switchToHttp()
          .getResponse<Response>();

        // Handle success responses
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          'status' in data
        ) {
          const statusCode = (data as SuccessResponse).code;
          response.status(statusCode);
          return data as SuccessResponse;
        }

        // Handle error responses
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          'error' in data
        ) {
          const statusCode = (data as ErrorResponse).code;
          response.status(statusCode);
          return data as ErrorResponse;
        }

        // Default response - wrap in standard success format
        const successResponse = ResponseUtil.success(
          data && typeof data === 'string' ? data : 'Operation successful',
          data && typeof data === 'object' ? data : null,
        );
        response.status(successResponse.code);
        return successResponse;
      }),
    );
  }
}
