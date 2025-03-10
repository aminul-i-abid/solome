import { Injectable, NestMiddleware } from '@nestjs/common';
import * as chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  // Log level colors
  private colors = {
    info: chalk.blue,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
    debug: chalk.cyan,
  };

  /**
   * Format date to MM/DD/YYYY, h:mm:ss AM/PM format
   * @param date The date to format
   * @returns Formatted date string
   */
  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  /**
   * Log a message with the specified level
   * @param level The log level (info, success, warn, error, debug)
   * @param message The message to log
   */
  private log(
    level: 'info' | 'success' | 'warn' | 'error' | 'debug',
    message: string,
  ): void {
    const timestamp = this.formatDate(new Date());
    const colorFn = this.colors[level] || chalk.white;
    const levelUppercase = level.toUpperCase();

    console.log(`[${timestamp}] ${colorFn(levelUppercase)} ${message}`);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    this.log('info', `${method} ${originalUrl} - Request received`);

    // Store the original res.json method
    const originalJson = res.json;
    let responseBody: unknown;

    // Override res.json to capture the response body
    res.json = function (body: unknown) {
      responseBody = body;
      return originalJson.call(this, body) as Response;
    };

    // Add response listener to log when request is completed
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;

      // Determine log level based on status code
      let level: 'info' | 'success' | 'warn' | 'error' = 'info';

      if (statusCode < 300) {
        level = 'success';
      } else if (statusCode < 400) {
        level = 'info';
      } else if (statusCode < 500) {
        level = 'warn';
      } else {
        level = 'error';
      }

      // Format response message
      let responseMessage = '';
      if (responseBody) {
        if (typeof responseBody === 'object' && responseBody !== null) {
          const typedResponse = responseBody as Record<string, unknown>;
          if ('message' in typedResponse) {
            responseMessage = ` - Message: "${String(typedResponse.message)}"`;
          } else if ('error' in typedResponse) {
            responseMessage = ` - Error: "${String(typedResponse.error)}"`;
          }
        } else if (typeof responseBody === 'string') {
          responseMessage = ` - Message: "${responseBody}"`;
        }
      }

      this.log(
        level,
        `${method} ${originalUrl} - Response sent - Status: ${statusCode} - ${responseTime}ms${responseMessage}`,
      );
    });

    next();
  }
}
