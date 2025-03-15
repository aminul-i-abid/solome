import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetTasksParamsDto } from './dto/get-tasks-params.dto';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: TaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getTasks(@Query() getTasksParamsDto: GetTasksParamsDto) {
    return this.tasksService.getTasks(getTasksParamsDto);
  }
}
