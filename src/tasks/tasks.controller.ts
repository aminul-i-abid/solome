import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GetTasksParamsDto } from './dto/get-tasks-params.dto';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Req() req: Request, @Body() createTaskDto: TaskDto) {
    return this.tasksService.createTask(req.user.userId, createTaskDto);
  }

  @Get()
  getTasks(@Req() req: Request, @Query() getTasksParamsDto: GetTasksParamsDto) {
    return this.tasksService.getTasks(req.user.userId, getTasksParamsDto);
  }

  @Patch(':taskId')
  updateTask(@Req() req: Request, @Body() updateTaskDto: TaskDto) {
    return this.tasksService.updateTask(req.params.taskId, updateTaskDto);
  }

  @Delete(':taskId')
  deleteTask(@Req() req: Request) {
    return this.tasksService.deleteTask(req.params.taskId);
  }
}
