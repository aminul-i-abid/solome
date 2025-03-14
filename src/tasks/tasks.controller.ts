import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Req() req: Request, @Body() createTaskDto: TaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }
}
