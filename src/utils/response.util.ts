import { HttpStatus } from '@nestjs/common';

export type SuccessResponse = {
  status: string;
  code: number;
  message: string;
  data?: object | object[] | null;
};

export type ErrorResponse = {
  error: string;
  code: number;
  message: string;
};

export class ResponseUtil {
  /**
   * Creates a standardized success response
   * @param message Success message
   * @param data Optional data to include in the response
   * @param code HTTP status code (defaults to 200 OK)
   * @param status Status string (defaults to 'success')
   * @returns Formatted success response object
   */
  static success<T = any>(
    message: string,
    data?: T,
    code: number = HttpStatus.OK,
    status: string = 'success',
  ): SuccessResponse {
    return {
      status,
      code,
      message,
      ...(data !== undefined && data !== null && { data }),
    };
  }

  /**
   * Creates a standardized error response
   * @param message Error message
   * @param code HTTP status code (defaults to 400 BAD_REQUEST)
   * @param error Error type (defaults to 'Bad Request')
   * @returns Formatted error response object
   */
  static error(
    message: string,
    code: number = HttpStatus.BAD_REQUEST,
    error = 'Bad Request',
  ): ErrorResponse {
    return {
      error,
      code,
      message,
    };
  }
}
