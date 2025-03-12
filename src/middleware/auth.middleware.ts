import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ResponseUtil } from 'src/utils/response.util';
import { TokenUtil } from 'src/utils/token.util';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          ResponseUtil.error(
            'Access token is missing',
            HttpStatus.UNAUTHORIZED,
            HttpStatus[HttpStatus.UNAUTHORIZED],
          ),
        );
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify the token
      const decoded = TokenUtil.verifyAccessToken(token);

      // Attach the decoded user information to the request object
      req.user = decoded;

      next();
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          ResponseUtil.error(
            'Invalid or expired access token',
            HttpStatus.UNAUTHORIZED,
            HttpStatus[HttpStatus.UNAUTHORIZED],
          ),
        );
    }
  }
}
