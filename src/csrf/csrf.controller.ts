import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { generateToken } from 'src/common/config/csrf.config';
import { ResponseUtil } from 'src/utils/response.util';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = generateToken(req, res);

    return res.json(
      ResponseUtil.success('CSRF token generated successfully', { token }),
    );
  }
}
