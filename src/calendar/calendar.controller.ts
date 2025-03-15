import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CalendarService } from './calendar.service';
import { CalendarParamsDto } from './dto/calendar-params.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getAllInProgressTasks(
    @Req() req: Request,
    @Query() getTasksParamsDto: CalendarParamsDto,
  ) {
    return this.calendarService.getAllInProgressTasks(
      req.user.userId,
      getTasksParamsDto,
    );
  }
}
