import { Controller, Get } from '@nestjs/common';
import { ResponseUtil } from 'src/utils/response.util';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return ResponseUtil.success('Server is running');
  }
}
