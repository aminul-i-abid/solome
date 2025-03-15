import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { GetTasksParamsDto } from './dto/get-tasks-params.dto';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(body: TaskDto) {
    if (!body.projectId) {
      throw new BadRequestException('Project ID is required');
    }
    try {
      // Use a transaction to ensure atomicity
      await this.prisma.$transaction(async (prisma) => {
        // Create the task
        const task = await prisma.task.create({
          data: {
            projectId: body.projectId,
            labelId: body.labelId,
            title: body.title,
            content: body.content,
            dueDate: body.dueDate,
            priority: body.priority,
            attachments: body.attachments,
            status: body.status,
            comments: body.comments,
          },
        });

        // Create subtasks
        if (body.subTasks && body.subTasks.length > 0) {
          await Promise.all(
            body.subTasks.map(async (subTask) => {
              return await prisma.subTask.create({
                data: {
                  taskId: task.id,
                  todo: subTask.todo,
                  isComplete: subTask.isComplete,
                },
              });
            }),
          );
        }

        // Create time log
        if (body.timeLog) {
          await prisma.timeLog.create({
            data: {
              taskId: task.id,
              startTime: body.timeLog.startTime,
              endTime: body.timeLog.endTime,
              duration: body.timeLog.duration,
            },
          });
        }
      });

      return ResponseUtil.success(
        'Task created successfully',
        null,
        HttpStatus.CREATED,
      );
    } catch (error) {
      Logger.error(error);
      return ResponseUtil.error(
        'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
      );
    }
  }

  async getTasks(params: GetTasksParamsDto) {
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId: params.project_id,
        labelId: params.label_id,
        dueDate: params.due_date,
        priority: params.priority,
        status: params.status,
      },
    });

    return ResponseUtil.success('Retrieve all tasks successfully', tasks);
  }
}
